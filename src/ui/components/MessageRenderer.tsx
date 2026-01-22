import React from 'react';
import { Box, Text } from 'ink';
import type { Message } from '../../store/types.js';
import { themeManager } from '../themes/index.js';

interface MessageRendererProps {
  message: Message;
}

export const MessageRenderer: React.FC<MessageRendererProps> = ({ message }) => {
  const theme = themeManager.getTheme();

  const renderUserMessage = () => (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={theme.colors.accent}>
        You:
      </Text>
      <Text color={theme.colors.text.primary}>{message.content}</Text>
    </Box>
  );

  const renderAssistantMessage = () => (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={theme.colors.success}>
        Assistant:
      </Text>
      <Text color={theme.colors.text.primary}>{message.content}</Text>
      {message.toolCalls && message.toolCalls.length > 0 && (
        <Box flexDirection="column" marginTop={1}>
          {message.toolCalls.map((toolCall, i) => (
            <Text key={i} color={theme.colors.warning}>
              🔧 {toolCall.name}({JSON.stringify(toolCall.args).slice(0, 50)}...)
            </Text>
          ))}
        </Box>
      )}
    </Box>
  );

  const renderToolMessage = () => (
    <Box flexDirection="column" marginBottom={1}>
      <Text color={theme.colors.text.muted} dimColor>
        Tool Result:
      </Text>
      <Text color={theme.colors.text.muted} dimColor>
        {message.content.slice(0, 200)}
        {message.content.length > 200 ? '...' : ''}
      </Text>
    </Box>
  );

  switch (message.role) {
    case 'user':
      return renderUserMessage();
    case 'assistant':
      return renderAssistantMessage();
    case 'tool':
      return renderToolMessage();
    default:
      return null;
  }
};
