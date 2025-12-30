import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import { execSync } from 'child_process';
import { DEFAULT_IGNORE_PATTERNS } from './ignore.js';

export const grepTool = new DynamicStructuredTool({
  name: 'grep',
  description: `A powerful search tool built on ripgrep for searching file contents with regex patterns.
ALWAYS use this tool for search tasks. NEVER invoke \`grep\` or \`rg\` as a Bash command.
Supports full regex syntax, file filtering, and various output modes.`,
  schema: z.object({
    pattern: z.string().describe('The regular expression pattern to search for in file contents. Uses ripgrep syntax - literal braces need escaping.'),
    path: z.string().optional().describe('File or directory to search in. Defaults to current working directory if not specified.'),
    glob: z.string().optional().describe('Glob pattern to filter files (e.g., "*.js", "*.{ts,tsx}").'),
    output_mode: z.enum(['content', 'files_with_matches', 'count']).optional().default('files_with_matches').describe('Output mode - "content" shows matching lines, "files_with_matches" shows only file paths, "count" shows match counts.'),
    B: z.number().optional().describe('Number of lines to show before each match. Only works with output_mode="content".'),
    A: z.number().optional().describe('Number of lines to show after each match. Only works with output_mode="content".'),
    C: z.number().optional().describe('Number of lines to show before and after each match. Only works with output_mode="content".'),
    n: z.boolean().optional().describe('Show line numbers in output. Only works with output_mode="content".'),
    i: z.boolean().optional().describe('Enable case insensitive search.'),
    type: z.string().optional().describe('File type to search (e.g., "js", "py", "rust", "go", "java").'),
    head_limit: z.number().optional().describe('Limit output to first N lines/entries.'),
    multiline: z.boolean().optional().default(false).describe('Enable multiline mode where patterns can span lines.'),
  }),
  func: async ({ pattern, path, glob, output_mode, B, A, C, n, i, type, head_limit, multiline }) => {
    const cmd = ['rg'];
    
    cmd.push(pattern);
    const searchPath = path || '.';
    cmd.push(searchPath);
    
    if (output_mode === 'files_with_matches') {
      cmd.push('-l');
    } else if (output_mode === 'count') {
      cmd.push('-c');
    }
    
    if (output_mode === 'content') {
      if (C !== undefined) {
        cmd.push('-C', String(C));
      } else {
        if (B !== undefined) {
          cmd.push('-B', String(B));
        }
        if (A !== undefined) {
          cmd.push('-A', String(A));
        }
      }
      if (n) {
        cmd.push('-n');
      }
    }
    
    if (i) {
      cmd.push('-i');
    }
    
    if (type) {
      cmd.push('--type', type);
    }
    
    if (glob) {
      cmd.push('--glob', glob);
    }
    
    for (const ignorePattern of DEFAULT_IGNORE_PATTERNS) {
      cmd.push('--glob', `!${ignorePattern}`);
    }
    
    if (multiline) {
      cmd.push('-U', '--multiline-dotall');
    }
    
    try {
      let output = execSync(cmd.join(' '), {
        encoding: 'utf8',
      }).toString();
      
      if (head_limit && output) {
        const lines = output.split('\n');
        output = lines.slice(0, head_limit).join('\n');
      }
      
      if (output) {
        return `Here's the result in ${searchPath}:\n\n\`\`\`\n${output}\n\`\`\``;
      } else {
        return 'No matches found.';
      }
    } catch (error: any) {
      if (error.status === 1) {
        return 'No matches found.';
      }
      return `Error: ${error.stderr || error.message}`;
    }
  },
});
