import { MCPClient } from './src/mcp/client.js';

const config = {
  transport: 'streamable_http',
  url: 'https://mcp.context7.com/mcp'
};

async function test() {
  try {
    const client = new MCPClient(config);
    await client.connect();
    console.log('Connected to context7 MCP server');
    
    const tools = await client.listTools();
    console.log('Available tools:', JSON.stringify(tools, null, 2));
    
    await client.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

test();