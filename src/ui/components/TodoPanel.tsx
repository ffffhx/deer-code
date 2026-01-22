import React from 'react';
import { Box, Text } from 'ink';
import { useSession, type Todo } from '../../store/index.js';
import { themeManager } from '../themes/index.js';

export const TodoPanel: React.FC = () => {
  const session = useSession();
  const theme = themeManager.getTheme();

  if (session.todos.length === 0) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✓';
      case 'in_progress':
        return '▶';
      case 'pending':
        return '○';
      default:
        return '○';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return theme.colors.success;
      case 'in_progress':
        return theme.colors.warning;
      case 'pending':
        return theme.colors.text.muted;
      default:
        return theme.colors.text.muted;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.info;
      default:
        return theme.colors.text.muted;
    }
  };

  return (
    <Box 
      flexDirection="column" 
      marginTop={1} 
      marginBottom={1}
      borderStyle="round" 
      borderColor={theme.colors.border.light} 
      paddingX={1}
    >
      <Text color={theme.colors.primary} bold>
        📝 Todo List ({session.todos.filter((t: Todo) => t.status === 'completed').length}/{session.todos.length})
      </Text>
      {session.todos.map((todo: Todo) => (
        <Box key={todo.id} flexDirection="row" marginLeft={2}>
          <Text color={getStatusColor(todo.status)}>
            {getStatusIcon(todo.status)}{' '}
          </Text>
          <Text color={theme.colors.text.primary}>
            {todo.content}
          </Text>
          <Text color={getPriorityColor(todo.priority)} dimColor>
            {' '}[{todo.priority}]
          </Text>
        </Box>
      ))}
    </Box>
  );
};
