import { spawn, ChildProcess } from 'child_process';
import {
  MCPServerConfig,
  MCPRequest,
  MCPResponse,
  MCPInitializeResult,
  MCPTool,
  MCPToolCallResult,
} from './types.js';
import { startupLogger } from '../utils/startup-logger.js';

export class MCPClient {
  private config: MCPServerConfig;
  private process?: ChildProcess;
  private requestId = 0;
  private pendingRequests = new Map<
    string | number,
    {
      resolve: (value: any) => void;
      reject: (error: any) => void;
    }
  >();
  private buffer = '';
  private initialized = false;
  private serverInfo?: MCPInitializeResult;

  constructor(config: MCPServerConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    if (this.config.transport === 'streamable_http') {
      await this.connectHTTP();
    } else {
      await this.connectStdio();
    }
  }

  private async connectStdio(): Promise<void> {
    if (!this.config.command) {
      throw new Error('Command is required for stdio transport');
    }

    this.process = spawn(this.config.command, this.config.args || [], {
      env: { ...process.env, ...this.config.env },
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    if (!this.process.stdout || !this.process.stdin) {
      throw new Error('Failed to create process pipes');
    }

    this.process.stdout.on('data', (data: Buffer) => {
      this.handleStdioData(data);
    });

    this.process.stderr?.on('data', (data: Buffer) => {
      const message = data.toString();
      const lowerMessage = message.toLowerCase();
      
      let type: 'info' | 'error' | 'warning' = 'info';
      if (lowerMessage.includes('error') || lowerMessage.includes('failed') || lowerMessage.includes('fatal')) {
        type = 'error';
      } else if (lowerMessage.includes('warn') || lowerMessage.includes('warning') || lowerMessage.includes('avoid')) {
        type = 'warning';
      }
      
      if (!this.initialized) {
        startupLogger.log(`MCP Server stderr: ${message}`, type);
      }
    });

    this.process.on('error', (error) => {
      startupLogger.log(`MCP Server process error: ${error.message}`, 'error');
      console.error('MCP Server process error:', error);
      this.rejectAllPending(error);
    });

    this.process.on('exit', (code) => {
      if (code !== 0) {
        const message = `MCP Server exited with code ${code}`;
        startupLogger.log(message, 'error');
        console.error(message);
      }
      this.rejectAllPending(new Error(`Process exited with code ${code}`));
    });

    await this.initialize();
  }

  private async connectHTTP(): Promise<void> {
    if (!this.config.url) {
      throw new Error('URL is required for HTTP transport');
    }
    await this.initialize();
  }

  private handleStdioData(data: Buffer): void {
    this.buffer += data.toString();
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          const message = JSON.parse(line);
          this.handleMessage(message);
        } catch (error) {
          console.error('Failed to parse MCP message:', error);
        }
      }
    }
  }

  private handleMessage(message: MCPResponse): void {
    const pending = this.pendingRequests.get(message.id);
    if (pending) {
      this.pendingRequests.delete(message.id);
      if (message.error) {
        pending.reject(
          new Error(`MCP Error: ${message.error.message}`)
        );
      } else {
        pending.resolve(message.result);
      }
    }
  }

  private async sendRequest(method: string, params?: any): Promise<any> {
    const id = ++this.requestId;
    const request: MCPRequest = {
      jsonrpc: '2.0',
      id,
      method,
      params,
    };

    if (this.config.transport === 'streamable_http') {
      return this.sendHTTPRequest(request);
    } else {
      return this.sendStdioRequest(request);
    }
  }

  private sendNotification(method: string, params?: any): void {
    const notification = {
      jsonrpc: '2.0',
      method,
      params,
    };

    if (this.config.transport === 'streamable_http') {
      return;
    }

    if (!this.process?.stdin) {
      throw new Error('Process not initialized');
    }

    const message = JSON.stringify(notification) + '\n';
    this.process.stdin.write(message);
  }

  private async sendStdioRequest(request: MCPRequest): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.process?.stdin) {
        reject(new Error('Process not initialized'));
        return;
      }

      this.pendingRequests.set(request.id, { resolve, reject });

      const message = JSON.stringify(request) + '\n';
      this.process.stdin.write(message, (error) => {
        if (error) {
          this.pendingRequests.delete(request.id);
          reject(error);
        }
      });

      setTimeout(() => {
        if (this.pendingRequests.has(request.id)) {
          this.pendingRequests.delete(request.id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  private async sendHTTPRequest(request: MCPRequest): Promise<any> {
    if (!this.config.url) {
      throw new Error('URL not configured');
    }

    const response = await fetch(this.config.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json() as MCPResponse;
    if (result.error) {
      throw new Error(`MCP Error: ${result.error.message}`);
    }

    return result.result;
  }

  private async initialize(): Promise<void> {
    const result = await this.sendRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: {
          listChanged: true,
        },
        sampling: {},
      },
      clientInfo: {
        name: 'deer-code',
        version: '0.1.0',
      },
    });

    this.serverInfo = result;
    this.initialized = true;

    this.sendNotification('notifications/initialized');
  }

  async listTools(): Promise<MCPTool[]> {
    if (!this.initialized) {
      throw new Error('Client not initialized');
    }

    const result = await this.sendRequest('tools/list');
    return result.tools || [];
  }

  async callTool(
    name: string,
    args: Record<string, any>
  ): Promise<MCPToolCallResult> {
    if (!this.initialized) {
      throw new Error('Client not initialized');
    }

    const result = await this.sendRequest('tools/call', {
      name,
      arguments: args,
    });

    return result;
  }

  async disconnect(): Promise<void> {
    this.rejectAllPending(new Error('Client disconnected'));

    if (this.process) {
      this.process.kill();
      this.process = undefined;
    }

    this.initialized = false;
  }

  private rejectAllPending(error: Error): void {
    for (const [id, pending] of this.pendingRequests.entries()) {
      pending.reject(error);
      this.pendingRequests.delete(id);
    }
  }

  getServerInfo(): MCPInitializeResult | undefined {
    return this.serverInfo;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
