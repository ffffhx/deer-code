import { BaseMessage, HumanMessage } from '@langchain/core/messages';
import { TokenCounter, TokenUsage } from './TokenCounter.js';
import { ChatOpenAI } from '@langchain/openai';

export interface ContextManagerConfig {
  maxTokens?: number;
  compressionThreshold?: number;
  modelName?: string;
  chatModel?: ChatOpenAI;
}

export interface CompressionResult {
  compressed: boolean;
  originalCount: number;
  compressedCount: number;
  tokensSaved: number;
}

export class ContextManager {
  private tokenCounter: TokenCounter;
  private maxTokens: number;
  private compressionThreshold: number;
  private chatModel?: ChatOpenAI;

  constructor(config: ContextManagerConfig = {}) {
    const {
      maxTokens = 100000,
      compressionThreshold = 0.8,
      modelName = 'deepseek-chat',
      chatModel,
    } = config;

    this.maxTokens = maxTokens;
    this.compressionThreshold = compressionThreshold;
    this.tokenCounter = new TokenCounter(modelName);
    this.chatModel = chatModel;
  }

  getTokenUsage(messages: BaseMessage[]): TokenUsage {
    return this.tokenCounter.getUsage(messages);
  }

  getTotalTokens(messages: BaseMessage[]): number {
    return this.tokenCounter.countMessagesTokens(messages);
  }

  shouldCompress(messages: BaseMessage[]): boolean {
    const totalTokens = this.getTotalTokens(messages);
    const threshold = this.maxTokens * this.compressionThreshold;
    return totalTokens > threshold;
  }

  async compressMessages(messages: BaseMessage[]): Promise<{
    messages: BaseMessage[];
    result: CompressionResult;
  }> {

    // 消息数量<=2的时候，不压缩
    if (messages.length <= 2) {
      return {
        messages,
        result: {
          compressed: false,
          originalCount: messages.length,
          compressedCount: messages.length,
          tokensSaved: 0,
        },
      };
    }
    // 记录原始token数量，用于计算最后节省了多少token
    const originalTokens = this.getTotalTokens(messages);
    // 找到系统消息
    const systemMessage = messages.find((m) => m._getType() === 'system');
    // 最近10条消息
    const recentMessages = messages.slice(-10);
    // 中间的消息
    const middleMessages = messages.slice(
      systemMessage ? 1 : 0,
      messages.length - 10
    );

    if (middleMessages.length === 0) {
      return {
        messages,
        result: {
          compressed: false,
          originalCount: messages.length,
          compressedCount: messages.length,
          tokensSaved: 0,
        },
      };
    }

    // 取中间的消息进行压缩
    const compressedMiddle = await this.compressMiddleMessages(middleMessages);

    const compressedMessages: BaseMessage[] = [];
    if (systemMessage) {
      compressedMessages.push(systemMessage);
    }
    compressedMessages.push(compressedMiddle);
    compressedMessages.push(...recentMessages);

    const compressedTokens = this.getTotalTokens(compressedMessages);

    return {
      messages: compressedMessages,
      result: {
        compressed: true,
        originalCount: messages.length,
        compressedCount: compressedMessages.length,
        tokensSaved: originalTokens - compressedTokens,
      },
    };
  }

  private async compressMiddleMessages(
    messages: BaseMessage[]
  ): Promise<HumanMessage> {
    if (!this.chatModel) {
      return this.simpleCompress(messages);
    }

    try {
      const conversationText = messages
        .map((m) => {
          const role = m._getType();
          const content =
            typeof m.content === 'string' ? m.content : JSON.stringify(m.content);
          return `[${role}]: ${content}`;
        })
        .join('\n\n');

      const compressionPrompt = `Please summarize the following conversation history concisely, preserving key information, decisions, and context:

${conversationText}

Provide a brief summary that captures the essential points:`;

      const response = await this.chatModel.invoke([
        new HumanMessage(compressionPrompt),
      ]);

      const summary =
        typeof response.content === 'string'
          ? response.content
          : JSON.stringify(response.content);

      return new HumanMessage({
        content: `[Compressed conversation history]\n${summary}`,
      });
    } catch (error) {
      console.error('Compression failed, using simple compression:', error);
      return this.simpleCompress(messages);
    }
  }

  private simpleCompress(messages: BaseMessage[]): HumanMessage {
    const summary = messages
      .map((m) => {
        const role = m._getType();
        const content =
          typeof m.content === 'string'
            ? m.content.slice(0, 100)
            : JSON.stringify(m.content).slice(0, 100);
        return `[${role}]: ${content}...`;
      })
      .join('\n');

    return new HumanMessage({
      content: `[Compressed conversation history - ${messages.length} messages]\n${summary}`,
    });
  }

  async manageContext(messages: BaseMessage[]): Promise<{
    messages: BaseMessage[];
    compressed: boolean;
    usage: TokenUsage;
    compressionResult?: CompressionResult;
  }> {
    const usage = this.getTokenUsage(messages);

    if (this.shouldCompress(messages)) {
      const { messages: compressedMessages, result } =
        await this.compressMessages(messages);

      return {
        messages: compressedMessages,
        compressed: true,
        usage: this.getTokenUsage(compressedMessages),
        compressionResult: result,
      };
    }

    return {
      messages,
      compressed: false,
      usage,
    };
  }

  cleanup(): void {
    this.tokenCounter.free();
  }
}
