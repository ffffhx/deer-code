import React from 'react';
import { render } from 'ink';
import { App } from '../ui/App.js';
import { SessionManager } from '../session/index.js';
import { initializeMCPServers } from '../mcp/index.js';
import { getConfigSection } from '../config/index.js';

export interface StartOptions {
  new?: boolean;
  name?: string;
}

export async function startCommand(options: StartOptions): Promise<void> {
  const mcpServersConfig = getConfigSection(['tools', 'mcp_servers']);
  if (mcpServersConfig) {
    try {
      await initializeMCPServers(mcpServersConfig);
    } catch (error) {
      console.error('[MCP] Failed to initialize MCP servers:', error);
    }
  }

  const sessionManager = new SessionManager();

  if (options.new) {
    const context = sessionManager.createSession(options.name || null);
    console.log(`Created new session: ${context.sessionId}`);
  }

  render(React.createElement(App));
}
