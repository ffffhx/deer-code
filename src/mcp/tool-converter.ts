import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { MCPTool } from './types.js';
import { MCPServerManager } from './manager.js';

function jsonSchemaToZod(schema: any): z.ZodTypeAny {
  if (!schema || typeof schema !== 'object') {
    return z.any();
  }

  const type = schema.type;

  if (type === 'string') {
    let zodType = z.string();
    if (schema.description) {
      zodType = zodType.describe(schema.description);
    }
    return zodType;
  }

  if (type === 'number' || type === 'integer') {
    let zodType = z.number();
    if (schema.description) {
      zodType = zodType.describe(schema.description);
    }
    return zodType;
  }

  if (type === 'boolean') {
    let zodType = z.boolean();
    if (schema.description) {
      zodType = zodType.describe(schema.description);
    }
    return zodType;
  }

  if (type === 'array') {
    const itemSchema = schema.items ? jsonSchemaToZod(schema.items) : z.any();
    let zodType = z.array(itemSchema);
    if (schema.description) {
      zodType = zodType.describe(schema.description);
    }
    return zodType;
  }

  if (type === 'object') {
    const properties = schema.properties || {};
    const required = schema.required || [];
    
    const shape: Record<string, z.ZodTypeAny> = {};
    
    for (const [key, value] of Object.entries(properties)) {
      const fieldSchema = jsonSchemaToZod(value);
      shape[key] = required.includes(key) ? fieldSchema : fieldSchema.optional();
    }

    let zodType = z.object(shape);
    if (schema.description) {
      zodType = zodType.describe(schema.description);
    }
    return zodType;
  }

  return z.any();
}

export function convertMCPToolToLangChain(
  serverName: string,
  mcpTool: MCPTool,
  manager: MCPServerManager
): DynamicStructuredTool {
  const schema = jsonSchemaToZod(mcpTool.inputSchema);

  return new DynamicStructuredTool({
    name: `mcp_${serverName}_${mcpTool.name}`,
    description: mcpTool.description || `MCP tool: ${mcpTool.name} from ${serverName}`,
    schema: schema as z.ZodObject<any>,
    func: async (input: Record<string, any>) => {
      try {
        const result = await manager.callTool(serverName, mcpTool.name, input);
        
        if (result.isError) {
          return `Error: ${JSON.stringify(result.content)}`;
        }

        const textContent = result.content
          .filter((c: any) => c.type === 'text')
          .map((c: any) => c.text)
          .join('\n');

        return textContent || JSON.stringify(result.content);
      } catch (error) {
        return `Error calling MCP tool: ${error instanceof Error ? error.message : String(error)}`;
      }
    },
  });
}

export async function loadMCPTools(
  manager: MCPServerManager
): Promise<DynamicStructuredTool[]> {
  const allTools = await manager.getAllTools();
  
  return allTools.map(({ serverName, tool }) =>
    convertMCPToolToLangChain(serverName, tool, manager)
  );
}
