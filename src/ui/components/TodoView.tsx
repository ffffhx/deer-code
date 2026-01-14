import React from 'react';
import { Box, Text } from 'ink';
import { TodoItem, TodoStatus } from '../../tools/todo/types.js';

interface TodoViewProps {
  todos: TodoItem[];
}

export const TodoView: React.FC<TodoViewProps> = ({ todos }) => {
  const getStatusIcon = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.completed:
        return '✅';
      case TodoStatus.in_progress:
        return '🔄';
      case TodoStatus.cancelled:
        return '❌';
      default:
        return '⏸️';
    }
  };

  const getStatusColor = (status: TodoStatus) => {
    switch (status) {
      case TodoStatus.completed:
        return 'green';
      case TodoStatus.in_progress:
        return 'yellow';
      case TodoStatus.cancelled:
        return 'red';
      default:
        return 'gray';
    }
  };

  return (
    <Box flexDirection="column" height="100%" paddingX={1}>
      <Box marginBottom={1}>
        <Text bold underline>
          TODO List
        </Text>
      </Box>
      <Box flexDirection="column">
        {todos.length > 0 ? (
          todos.map((todo) => (
            <Box key={todo.id} marginBottom={1}>
              <Text color={getStatusColor(todo.status)}>
                {getStatusIcon(todo.status)} {todo.content}
              </Text>
            </Box>
          ))
        ) : (
          <Text color="gray">No todos</Text>
        )}
      </Box>
    </Box>
  );
};
