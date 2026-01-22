import React from 'react';
import { Box, Text, Static } from 'ink';
import { useApp, useSession, type Message } from '../../store/index.js';
import { MessageRenderer } from './MessageRenderer.js';
import { ThinkingBlock } from './ThinkingBlock.js';
import { themeManager } from '../themes/index.js';

export const MessageArea: React.FC = () => {
  const app = useApp();
  const session = useSession();
  const theme = themeManager.getTheme();

  const { displayMessages, currentStreamingBuffer, thinkingSteps } = session;

  return (
    <Box flexDirection="column" flexGrow={1} paddingX={1} paddingY={1}>
      <Static items={displayMessages}>
        {(message: Message) => (
          <MessageRenderer key={message.id} message={message} />
        )}
      </Static>

      {currentStreamingBuffer && (
        <Box flexDirection="column" marginBottom={1}>
          <Text bold color={theme.colors.success}>
            Assistant:
          </Text>
          <Text color={theme.colors.text.primary}>{currentStreamingBuffer}</Text>
        </Box>
      )}

      {app.isProcessing && thinkingSteps.length > 0 && (
        <ThinkingBlock steps={thinkingSteps} />
      )}

      {app.isProcessing && thinkingSteps.length === 0 && !currentStreamingBuffer && (
        <Box marginTop={1}>
          <Text color={theme.colors.warning}>⏳ Thinking...</Text>
        </Box>
      )}
    </Box>
  );
};
