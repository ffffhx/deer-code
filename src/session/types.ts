import { BaseMessage } from '@langchain/core/messages';
import { TodoItem } from '../tools/todo/types.js';
import { TokenUsage } from '../context/index.js';

export interface SessionContext {
  sessionId: string;
  messages: BaseMessage[];
  userName: string | null;
  todos: TodoItem[];
  createdAt: number;
  updatedAt: number;
  tokenUsage?: TokenUsage;
  compressionCount?: number;
}

export interface SessionMetadata {
  sessionId: string;
  userName: string | null;
  messageCount: number;
  createdAt: number;
  updatedAt: number;
}
