import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { BashTerminal } from './bash-terminal.js';
import { project } from '../../project.js';

let keepAliveTerminal: BashTerminal | null = null;

export const bashTool = new DynamicStructuredTool({
  name: 'bash',
  description: `Execute a standard bash command in a keep-alive shell, and return the output if successful or error message if failed.

Use this tool to perform:
- Create directories
- Install dependencies
- Start development server
- Run tests and linting
- Git operations

Never use this tool to perform any harmful or dangerous operations.

- Use \`ls\`, \`grep\` and \`tree\` tools for file system operations instead of this tool.
- Use \`text_editor\` tool with \`create\` command to create new files.`,
  schema: z.object({
    command: z.string().describe('The command to execute.'),
    reset_cwd: z.boolean().nullable().default(false).describe('Whether to reset the current working directory to the project root directory.'),
  }),
  func: async ({ command, reset_cwd }: { command: string; reset_cwd?: boolean | null }) => {
    if (keepAliveTerminal === null) {
      keepAliveTerminal = new BashTerminal(project.rootDir);
    } else if (reset_cwd === true) {
      keepAliveTerminal.close();
      keepAliveTerminal = new BashTerminal(project.rootDir);
    }

    try {
      const output = await keepAliveTerminal.execute(command);
      return `\`\`\`\n${output}\n\`\`\``;
    } catch (error) {
      return `Error: ${error}`;
    }
  },
});
