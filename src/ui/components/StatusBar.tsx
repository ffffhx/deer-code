import React from 'react';
import { Box, Text } from 'ink';
import { useApp, useSession } from '../../store/index.js';
import { themeManager } from '../themes/index.js';

export const StatusBar: React.FC = () => {
  const app = useApp();
  const session = useSession();
  const theme = themeManager.getTheme();

  const todoCount = session.todos.length;
  const completedCount = session.todos.filter((t: { status: string }) => t.status === 'completed').length;
  const inProgressCount = session.todos.filter((t: { status: string }) => t.status === 'in_progress').length;

  return (
    <Box 
      flexDirection="row" 
      justifyContent="space-between" 
      paddingX={2} 
      paddingY={0}
      borderStyle="single"
      borderColor={theme.colors.border.light}
    >
      <Box flexDirection="row" gap={1}>
        <Text color={theme.colors.text.muted}>
          🦌 DeerCode
        </Text>
        <Text color={theme.colors.text.muted}>·</Text>
        <Text color={theme.colors.info}>
          {theme.name}
        </Text>
        {app.activeModal && (
          <>
            <Text color={theme.colors.text.muted}>·</Text>
            <Text color={theme.colors.warning}>
              {app.activeModal}
            </Text>
          </>
        )}
      </Box>

      <Box flexDirection="row" gap={1}>
        {todoCount > 0 && (
          <>
            <Text color={theme.colors.text.muted}>
              📝 {completedCount}/{todoCount}
            </Text>
            {inProgressCount > 0 && (
              <Text color={theme.colors.warning}>
                ({inProgressCount} active)
              </Text>
            )}
            <Text color={theme.colors.text.muted}>·</Text>
          </>
        )}
        <Text color={app.isProcessing ? theme.colors.success : theme.colors.text.muted}>
          {app.isProcessing ? '⚡ Processing...' : '✓ Ready'}
        </Text>
        <Text color={theme.colors.text.muted}>·</Text>
        <Text color={theme.colors.text.muted}>
          ? for help
        </Text>
      </Box>
    </Box>
  );
};
