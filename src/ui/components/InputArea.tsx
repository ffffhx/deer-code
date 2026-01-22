import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import TextInput from 'ink-text-input';
import { useApp } from '../../store/index.js';
import { themeManager } from '../themes/index.js';

interface InputAreaProps {
  onSubmit: (message: string) => void;
}

export const InputArea: React.FC<InputAreaProps> = ({ onSubmit }) => {
  const [input, setInput] = useState('');
  const app = useApp();
  const theme = themeManager.getTheme();

  useInput((_inputChar, key) => {
    if (key.return && !app.isProcessing) {
      if (input.trim()) {
        onSubmit(input);
        setInput('');
      }
    }
  });

  return (
    <Box 
      flexDirection="row" 
      paddingX={2} 
      paddingY={0}
      borderStyle="single"
      borderColor={theme.colors.border.light}
    >
      <Text color={theme.colors.accent} bold>
        {'> '}
      </Text>
      {!app.isProcessing ? (
        <TextInput
          value={input}
          onChange={setInput}
          placeholder="Type your message... (Enter to send)"
        />
      ) : (
        <Text color={theme.colors.text.muted}>Processing...</Text>
      )}
    </Box>
  );
};
