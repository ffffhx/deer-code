import { ToolInfo } from './types.js';

export function generateToolListPrompt(tools: ToolInfo[]): string {
  if (tools.length === 0) {
    return '';
  }

  const builtinTools = tools.filter(t => t.category === 'builtin' || !t.category);
  const mcpTools = tools.filter(t => t.category === 'mcp');
  const customTools = tools.filter(t => t.category === 'custom');

  let prompt = '\n# Available Tools\n';

  if (builtinTools.length > 0) {
    prompt += '\n## Built-in Tools\n';
    builtinTools.forEach(tool => {
      prompt += `- ${tool.name}: ${tool.description}\n`;
    });
  }

  if (mcpTools.length > 0) {
    prompt += '\n## MCP Tools\n';
    mcpTools.forEach(tool => {
      prompt += `- ${tool.name}: ${tool.description}\n`;
    });
  }

  if (customTools.length > 0) {
    prompt += '\n## Custom Tools\n';
    customTools.forEach(tool => {
      prompt += `- ${tool.name}: ${tool.description}\n`;
    });
  }

  return prompt;
}

export function generateToolUsageGuidelines(): string {
  return `
# Tool Usage Guidelines

## File Operations
- Use 'text_editor' for viewing and editing files
- Use 'ls' to list directory contents
- Use 'tree' to understand project structure
- Use 'grep' to search for specific patterns

## Command Execution
- Use 'bash' to execute shell commands
- Always check command output for errors
- Use appropriate flags for safer operations

## Search Operations
- Use 'grep' for content-based searches
- Use 'ls' with patterns for file listing
- Use 'tree' for hierarchical structure

## Task Management
- Use 'todo_write' to track complex tasks
- Update task status as you progress
- Mark tasks completed immediately after finishing

## Best Practices
- Batch independent operations together
- Check file existence before operations
- Handle errors gracefully
- Provide clear feedback to users
`;
}
