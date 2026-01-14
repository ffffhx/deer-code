import React from 'react';
import { Box, Text } from 'ink';
import { OpenFile } from '../../store/index.js';

interface EditorViewProps {
  openFiles: OpenFile[];
  activeFilePath: string | null;
}

export const EditorView: React.FC<EditorViewProps> = ({ openFiles, activeFilePath }) => {
  const activeFile = openFiles.find((f) => f.path === activeFilePath);

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="single" borderColor="blue" paddingX={1}>
        {openFiles.length > 0 ? (
          openFiles.map((file) => (
            <Text
              key={file.path}
              color={file.path === activeFilePath ? 'blue' : 'gray'}
              bold={file.path === activeFilePath}
            >
              {' '}
              {file.path.split('/').pop()}{' '}
            </Text>
          ))
        ) : (
          <Text color="gray">No files open</Text>
        )}
      </Box>
      <Box flexDirection="column" flexGrow={1} paddingX={1} paddingY={1}>
        {activeFile ? (
          <>
            <Text color="gray" dimColor>
              {activeFile.path}
            </Text>
            <Box marginTop={1}>
              <Text>{activeFile.content}</Text>
            </Box>
          </>
        ) : (
          <Text color="gray">Select a file to view</Text>
        )}
      </Box>
    </Box>
  );
};
