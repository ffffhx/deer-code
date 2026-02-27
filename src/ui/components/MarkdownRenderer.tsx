import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';
import chalk from 'chalk';
import { themeManager } from '../themes/index.js';

interface MarkdownRendererProps {
  content: string;
  color?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, color }) => {
  const theme = themeManager.getTheme();

  const renderedContent = useMemo(() => {
    const renderer = new TerminalRenderer({
      code: chalk.hex(theme.colors.syntax.keyword),
      codespan: chalk.hex(theme.colors.syntax.string),
      blockquote: chalk.hex(theme.colors.text.muted).italic,
      html: chalk.hex(theme.colors.syntax.tag),
      heading: chalk.hex(theme.colors.accent).bold,
      firstHeading: chalk.hex(theme.colors.accent).bold,
      hr: chalk.hex(theme.colors.border.light),
      listitem: chalk.hex(theme.colors.text.primary),
      table: chalk.hex(theme.colors.text.primary),
      paragraph: chalk.hex(theme.colors.text.primary),
      strong: chalk.hex(theme.colors.warning).bold,
      em: chalk.hex(theme.colors.info).italic,
      del: chalk.hex(theme.colors.text.muted).strikethrough,
      link: chalk.hex(theme.colors.accent).underline,
      href: chalk.hex(theme.colors.accent).underline,
      unescape: true,
      emoji: true,
      width: 80,
      showSectionPrefix: false,
      reflowText: true,
      tab: 2,
    });

    marked.setOptions({ renderer: renderer as unknown as typeof marked.defaults.renderer });

    try {
      const result = marked.parse(content);
      if (typeof result === 'string') {
        return result.trim();
      }
      return content;
    } catch {
      return content;
    }
  }, [content, theme]);

  return (
    <Box flexDirection="column">
      <Text color={color}>{renderedContent}</Text>
    </Box>
  );
};
