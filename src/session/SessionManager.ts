import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { BaseMessage } from '@langchain/core/messages';
import {
  HumanMessage,
  AIMessage,
  SystemMessage,
  ToolMessage,
} from '@langchain/core/messages';
import { SessionContext, SessionMetadata } from './types.js';

const STORAGE_DIR = path.join(os.homedir(), '.deer-code');
const SESSIONS_DIR = path.join(STORAGE_DIR, 'sessions');
const CURRENT_SESSION_FILE = path.join(STORAGE_DIR, 'current-session.txt');

if (!fs.existsSync(SESSIONS_DIR)) {
  fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

function serializeMessages(messages: BaseMessage[]): any[] {
  return messages.map((msg) => ({
    type: msg._getType(),
    content: msg.content,
    additional_kwargs: msg.additional_kwargs,
    response_metadata: (msg as any).response_metadata,
    tool_call_id: (msg as any).tool_call_id,
  }));
}

function deserializeMessages(serialized: any[]): BaseMessage[] {
  if (!Array.isArray(serialized)) return [];

  return serialized.map((msg) => {
    const baseProps = {
      content: msg.content,
      additional_kwargs: msg.additional_kwargs || {},
    };

    switch (msg.type) {
      case 'human':
        return new HumanMessage(baseProps);
      case 'ai':
        return new AIMessage({
          ...baseProps,
          response_metadata: msg.response_metadata || {},
        });
      case 'system':
        return new SystemMessage(baseProps);
      case 'tool':
        return new ToolMessage({
          ...baseProps,
          tool_call_id: msg.tool_call_id || '',
        });
      default:
        return new HumanMessage(baseProps);
    }
  });
}

export class SessionManager {
  private currentSessionId: string | null = null;

  constructor() {
    this.loadCurrentSessionId();
  }

  private loadCurrentSessionId(): void {
    try {
      if (fs.existsSync(CURRENT_SESSION_FILE)) {
        this.currentSessionId = fs.readFileSync(CURRENT_SESSION_FILE, 'utf-8').trim();
      }
    } catch (error) {
      console.error('Error loading current session ID:', error);
    }
  }

  private saveCurrentSessionId(sessionId: string): void {
    try {
      fs.writeFileSync(CURRENT_SESSION_FILE, sessionId, 'utf-8');
      this.currentSessionId = sessionId;
    } catch (error) {
      console.error('Error saving current session ID:', error);
    }
  }

  private getSessionFilePath(sessionId: string): string {
    return path.join(SESSIONS_DIR, `${sessionId}.json`);
  }

  createSession(userName: string | null = null): SessionContext {
    const sessionId = `session-${Date.now()}`;
    const now = Date.now();

    const context: SessionContext = {
      sessionId,
      messages: [],
      userName,
      todos: [],
      createdAt: now,
      updatedAt: now,
    };

    this.saveSession(context);
    this.saveCurrentSessionId(sessionId);

    return context;
  }

  saveSession(context: SessionContext): void {
    try {
      const filePath = this.getSessionFilePath(context.sessionId);
      const data = {
        ...context,
        messages: serializeMessages(context.messages),
        updatedAt: Date.now(),
      };
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving session:', error);
    }
  }

  loadSession(sessionId: string): SessionContext | null {
    try {
      const filePath = this.getSessionFilePath(sessionId);
      if (!fs.existsSync(filePath)) {
        return null;
      }

      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return {
        ...data,
        messages: deserializeMessages(data.messages || []),
      };
    } catch (error) {
      console.error('Error loading session:', error);
      return null;
    }
  }

  getCurrentSession(): SessionContext {
    if (this.currentSessionId) {
      const session = this.loadSession(this.currentSessionId);
      if (session) {
        return session;
      }
    }

    return this.createSession();
  }

  getCurrentSessionId(): string | null {
    return this.currentSessionId;
  }

  listSessions(): SessionMetadata[] {
    try {
      const files = fs.readdirSync(SESSIONS_DIR);
      const sessions: SessionMetadata[] = [];

      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(SESSIONS_DIR, file);
          const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
          sessions.push({
            sessionId: data.sessionId,
            userName: data.userName,
            messageCount: data.messages?.length || 0,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          });
        }
      }

      return sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('Error listing sessions:', error);
      return [];
    }
  }

  deleteSession(sessionId: string): boolean {
    try {
      const filePath = this.getSessionFilePath(sessionId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        if (this.currentSessionId === sessionId) {
          this.currentSessionId = null;
          if (fs.existsSync(CURRENT_SESSION_FILE)) {
            fs.unlinkSync(CURRENT_SESSION_FILE);
          }
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  switchSession(sessionId: string): SessionContext | null {
    const session = this.loadSession(sessionId);
    if (session) {
      this.saveCurrentSessionId(sessionId);
      return session;
    }
    return null;
  }

  updateSessionContext(
    context: SessionContext,
    updates: Partial<Omit<SessionContext, 'sessionId' | 'createdAt'>>
  ): SessionContext {
    const updatedContext: SessionContext = {
      ...context,
      ...updates,
      updatedAt: Date.now(),
    };
    this.saveSession(updatedContext);
    return updatedContext;
  }
}
