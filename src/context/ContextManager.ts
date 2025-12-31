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
      modelName = 'gpt-4',
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

    const originalTokens = this.getTotalTokens(messages);

    const systemMessage = messages.find((m) => m._getType() === 'system');
    const recentMessages = messages.slice(-10);

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
