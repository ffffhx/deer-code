import { BaseMessage } from '@langchain/core/messages';
import { TodoItem } from '../tools/todo/types.js';

export interface CodingAgentState {
  messages: BaseMessage[];
  todos: TodoItem[];
}
