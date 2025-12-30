import React from 'react';
import { Box, Text } from 'ink';

interface TerminalViewProps {
  output: string[];
}

export const TerminalView: React.FC<TerminalViewProps> = ({ output }) => {
  return (
    <Box flexDirection="column" height="100%" paddingX={1}>
      <Box marginBottom={1}>
        <Text bold underline>
          Terminal
        </Text>
      </Box>
      <Box flexDirection="column">
        {output.length > 0 ? (
          output.map((line, index) => (
            <Text key={index} color="green">
              {line}
            </Text>
          ))
        ) : (
          <Text color="gray">No terminal output</Text>
        )}
      </Box>
    </Box>
  );
};
