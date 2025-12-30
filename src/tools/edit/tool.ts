import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import path from 'path';
import { TextEditor } from './text-editor.js';

export const textEditorTool = new DynamicStructuredTool({
  name: 'text_editor',
  description: `A text editor tool supports view, create, str_replace, insert.

- \`view\` again when you fail to perform \`str_replace\` or \`insert\`.
- \`create\` can also be used to overwrite an existing file.
- \`str_replace\` can also be used to delete text in the file.`,
  schema: z.object({
    command: z.enum(['view', 'create', 'str_replace', 'insert']).describe('One of "view", "create", "str_replace", "insert".'),
    path: z.string().describe('The absolute path to the file. Only absolute paths are supported. Automatically create the directories if it doesn\'t exist.'),
    file_text: z.string().optional().describe('Only applies for the "create" command. The text to write to the file.'),
    view_range: z.tuple([z.number(), z.number()]).optional().describe('Only applies for the "view" command. An array of two integers specifying the start and end line numbers to view. Line numbers are 1-indexed, and -1 for the end line means read to the end of the file.'),
    old_str: z.string().optional().describe('Only applies for the "str_replace" command. The text to replace (must match exactly, including whitespace and indentation).'),
    new_str: z.string().optional().describe('Only applies for the "str_replace" and "insert" commands. The new text to insert in place of the old text.'),
    insert_line: z.number().optional().describe('Only applies for the "insert" command. The line number after which to insert the text (0 for beginning of file).'),
  }),
  func: async ({ command, path: filePath, file_text, view_range, old_str, new_str, insert_line }) => {
    const resolvedPath = path.resolve(filePath);

    try {
      const editor = new TextEditor();
      editor.validatePath(command, resolvedPath);

      if (command === 'view') {
        const content = editor.view(resolvedPath, view_range);
        return `Here's the result of running \`cat -n\` on ${resolvedPath}:\n\n\`\`\`\n${content}\n\`\`\``;
      } else if (command === 'str_replace' && old_str !== undefined && new_str !== undefined) {
        const occurrences = editor.strReplace(resolvedPath, old_str, new_str);
        return `Successfully replaced ${occurrences} occurrences in ${resolvedPath}.`;
      } else if (command === 'insert' && insert_line !== undefined && new_str !== undefined) {
        editor.insert(resolvedPath, insert_line, new_str);
        return `Successfully inserted text at line ${insert_line} in ${filePath}.`;
      } else if (command === 'create') {
        editor.writeFile(resolvedPath, file_text || '');
        return `File successfully created at ${resolvedPath}.`;
      } else {
        return `Error: invalid command: ${command}`;
      }
    } catch (error) {
      return `Error: ${error}`;
    }
  },
});
