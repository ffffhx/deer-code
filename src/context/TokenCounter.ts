import { BaseMessage } from '@langchain/core/messages';
import { encodingForModel, TiktokenModel } from 'js-tiktoken';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
}

export class TokenCounter {
  private encoding: any;

  constructor(modelName: string = 'gpt-4') {
    try {
      this.encoding = encodingForModel(modelName as TiktokenModel);
    } catch (error) {
      this.encoding = encodingForModel('gpt-4');
    }
  }

  countTokens(text: string): number {
    if (!text) return 0;
    try {
      const tokens = this.encoding.encode(text);
      return tokens.length;
    } catch (error) {
      return Math.ceil(text.length / 4);
    }
  }

  countMessageTokens(message: BaseMessage): number {
    let tokens = 0;
    
    if (typeof message.content === 'string') {
      tokens += this.countTokens(message.content);
    } else if (Array.isArray(message.content)) {
      for (const content of message.content) {
        if (typeof content === 'string') {
          tokens += this.countTokens(content);
        } else if (content.type === 'text') {
          tokens += this.countTokens(content.text);
        }
      }
    }

    tokens += 4;

    if (message.additional_kwargs) {
      const additionalStr = JSON.stringify(message.additional_kwargs);
      tokens += this.countTokens(additionalStr);
    }

    return tokens;
  }

  countMessagesTokens(messages: BaseMessage[]): number {
    let totalTokens = 0;
    for (const message of messages) {
      totalTokens += this.countMessageTokens(message);
    }
    totalTokens += 3;
    return totalTokens;
  }

  getUsage(messages: BaseMessage[]): TokenUsage {
    let inputTokens = 0;
    let outputTokens = 0;

    for (const message of messages) {
      const tokens = this.countMessageTokens(message);
      if (message._getType() === 'ai') {
        outputTokens += tokens;
      } else {
        inputTokens += tokens;
      }
    }

    return {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
    };
  }

  free(): void {
    if (this.encoding && this.encoding.free) {
      this.encoding.free();
    }
  }
}
