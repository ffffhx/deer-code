export interface SlashCommand {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  execute: (args: string[], context: SlashCommandContext) => SlashCommandResult;
}

export interface SlashCommandContext {
  clearMessages: () => void;
  toggleTodoPanel: () => void;
  setTheme: (theme: string) => void;
  exitApp: () => void;
}

export interface SlashCommandResult {
  success: boolean;
  message?: string;
  action?: 'none' | 'clear' | 'exit';
}

const commands: SlashCommand[] = [
  {
    name: 'help',
    aliases: ['h', '?'],
    description: 'Show available commands',
    execute: () => {
      const helpText = formatHelpText();
      return { success: true, message: helpText };
    },
  },
  {
    name: 'clear',
    aliases: ['cls', 'c'],
    description: 'Clear the chat history',
    execute: (_, context) => {
      context.clearMessages();
      return { success: true, message: '✓ Chat history cleared', action: 'clear' };
    },
  },
  {
    name: 'todo',
    aliases: ['t'],
    description: 'Toggle the todo panel visibility',
    execute: (_, context) => {
      context.toggleTodoPanel();
      return { success: true, message: '✓ Todo panel toggled' };
    },
  },
  {
    name: 'theme',
    aliases: [],
    description: 'Change the color theme',
    usage: '/theme <theme-name>',
    execute: (args, context) => {
      const availableThemes = ['ayu-dark', 'dracula', 'monokai', 'nord', 'one-dark'];
      if (args.length === 0) {
        return {
          success: true,
          message: `Available themes: ${availableThemes.join(', ')}\nUsage: /theme <theme-name>`,
        };
      }
      const themeName = args[0].toLowerCase();
      if (availableThemes.includes(themeName)) {
        context.setTheme(themeName);
        return { success: true, message: `✓ Theme changed to: ${themeName}` };
      }
      return {
        success: false,
        message: `Unknown theme: ${themeName}\nAvailable themes: ${availableThemes.join(', ')}`,
      };
    },
  },
  {
    name: 'exit',
    aliases: ['quit', 'q'],
    description: 'Exit the application',
    execute: () => {
      return { success: true, message: 'Goodbye! 👋', action: 'exit' };
    },
  },
  {
    name: 'version',
    aliases: ['v'],
    description: 'Show version information',
    execute: () => {
      return { success: true, message: '🦌 DeerCode v0.1.0' };
    },
  },
  {
    name: 'shortcuts',
    aliases: ['keys', 'hotkeys'],
    description: 'Show keyboard shortcuts',
    execute: () => {
      const shortcuts = [
        'Keyboard Shortcuts:',
        '',
        '  Enter     - Send message',
        '  Ctrl+C    - Exit application',
        '  /help     - Show available commands',
        '  /clear    - Clear chat history',
        '  /todo     - Toggle todo panel',
      ];
      return { success: true, message: shortcuts.join('\n') };
    },
  },
];

function formatHelpText(): string {
  const lines = [
    '📖 Available Commands:',
    '',
  ];

  for (const cmd of commands) {
    const aliases = cmd.aliases && cmd.aliases.length > 0 
      ? ` (aliases: ${cmd.aliases.map(a => `/${a}`).join(', ')})` 
      : '';
    lines.push(`  /${cmd.name}${aliases}`);
    lines.push(`    ${cmd.description}`);
    if (cmd.usage) {
      lines.push(`    Usage: ${cmd.usage}`);
    }
    lines.push('');
  }

  lines.push('Tip: Type any message without "/" to chat with the AI assistant.');
  
  return lines.join('\n');
}

export function isSlashCommand(input: string): boolean {
  return input.trim().startsWith('/');
}

export function parseSlashCommand(input: string): { command: string; args: string[] } | null {
  const trimmed = input.trim();
  if (!trimmed.startsWith('/')) {
    return null;
  }

  const parts = trimmed.slice(1).split(/\s+/);
  const command = parts[0].toLowerCase();
  const args = parts.slice(1);

  return { command, args };
}

export function findCommand(commandName: string): SlashCommand | undefined {
  const lowerName = commandName.toLowerCase();
  return commands.find(
    cmd => cmd.name === lowerName || (cmd.aliases && cmd.aliases.includes(lowerName))
  );
}

export function executeSlashCommand(
  input: string,
  context: SlashCommandContext
): SlashCommandResult {
  const parsed = parseSlashCommand(input);
  
  if (!parsed) {
    return { success: false, message: 'Invalid command format' };
  }

  const command = findCommand(parsed.command);
  
  if (!command) {
    return { 
      success: false, 
      message: `Unknown command: /${parsed.command}\nType /help to see available commands.` 
    };
  }

  return command.execute(parsed.args, context);
}

export function getCommandSuggestions(partial: string): string[] {
  if (!partial.startsWith('/')) {
    return [];
  }

  const search = partial.slice(1).toLowerCase();
  const suggestions: string[] = [];

  for (const cmd of commands) {
    if (cmd.name.startsWith(search)) {
      suggestions.push(`/${cmd.name}`);
    }
    if (cmd.aliases) {
      for (const alias of cmd.aliases) {
        if (alias.startsWith(search) && !suggestions.includes(`/${alias}`)) {
          suggestions.push(`/${alias}`);
        }
      }
    }
  }

  return suggestions;
}
