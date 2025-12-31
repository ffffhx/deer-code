import { MCPClient } from './client.js';
import { MCPServerConfig, MCPTool } from './types.js';

export class MCPServerManager {
  private servers = new Map<string, MCPClient>();
  private serverConfigs = new Map<string, MCPServerConfig>();

  async addServer(name: string, config: MCPServerConfig): Promise<void> {
    if (this.servers.has(name)) {
      throw new Error(`MCP server '${name}' already exists`);
    }

    const client = new MCPClient(config);
    
    try {
      await client.connect();
      this.servers.set(name, client);
      this.serverConfigs.set(name, config);
      
      const serverInfo = client.getServerInfo();
      console.log(`[MCP] Connected to server '${name}': ${serverInfo?.serverInfo.name} v${serverInfo?.serverInfo.version}`);
    } catch (error) {
      console.error(`[MCP] Failed to connect to server '${name}':`, error);
      throw error;
    }
  }

  async removeServer(name: string): Promise<void> {
    const client = this.servers.get(name);
    if (client) {
      await client.disconnect();
      this.servers.delete(name);
      this.serverConfigs.delete(name);
      console.log(`[MCP] Disconnected from server '${name}'`);
    }
  }

  getServer(name: string): MCPClient | undefined {
    return this.servers.get(name);
  }

  getAllServers(): Map<string, MCPClient> {
    return this.servers;
  }

  async getAllTools(): Promise<Array<{ serverName: string; tool: MCPTool }>> {
    const allTools: Array<{ serverName: string; tool: MCPTool }> = [];

    for (const [serverName, client] of this.servers.entries()) {
      try {
        const tools = await client.listTools();
        for (const tool of tools) {
          allTools.push({ serverName, tool });
        }
      } catch (error) {
        console.error(`[MCP] Failed to list tools from server '${serverName}':`, error);
      }
    }

    return allTools;
  }

  async callTool(
    serverName: string,
    toolName: string,
    args: Record<string, any>
  ): Promise<any> {
    const client = this.servers.get(serverName);
    if (!client) {
      throw new Error(`MCP server '${serverName}' not found`);
    }

    return await client.callTool(toolName, args);
  }

  async disconnectAll(): Promise<void> {
    const disconnectPromises: Promise<void>[] = [];
    
    for (const [name, client] of this.servers.entries()) {
      disconnectPromises.push(
        client.disconnect().catch((error) => {
          console.error(`[MCP] Error disconnecting from server '${name}':`, error);
        })
      );
    }

    await Promise.all(disconnectPromises);
    this.servers.clear();
    this.serverConfigs.clear();
  }

  getServerNames(): string[] {
    return Array.from(this.servers.keys());
  }

  hasServer(name: string): boolean {
    return this.servers.has(name);
  }

  getServerCount(): number {
    return this.servers.size;
  }
}

let globalManager: MCPServerManager | null = null;

export function getGlobalMCPManager(): MCPServerManager {
  if (!globalManager) {
    globalManager = new MCPServerManager();
  }
  return globalManager;
}

export async function initializeMCPServers(
  serversConfig: Record<string, MCPServerConfig>
): Promise<MCPServerManager> {
  const manager = getGlobalMCPManager();

  const initPromises = Object.entries(serversConfig).map(
    async ([name, config]) => {
      try {
        await manager.addServer(name, config);
      } catch (error) {
        console.error(`[MCP] Failed to initialize server '${name}':`, error);
      }
    }
  );

  await Promise.all(initPromises);

  return manager;
}
