import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { BaseMessage, HumanMessage, AIMessage, ToolMessage } from '@langchain/core/messages';

interface ChatViewProps {
  messages: BaseMessage[];
  isGenerating: boolean;
  onSubmit: (message: string) => void;
  thinkingSteps?: ThinkingStep[];
}

export interface ThinkingStep {
  type: 'tool_call' | 'tool_result' | 'reasoning';
  timestamp: number;
  content: string;
  toolName?: string;
  args?: any;
  result?: string;
}

export const ChatView: React.FC<ChatViewProps> = ({ messages, isGenerating, onSubmit, thinkingSteps = [] }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim() && !isGenerating) {
      onSubmit(input);
      setInput('');
    }
  };

  const renderThinkingStep = (step: ThinkingStep, index: number) => {
    if (step.type === 'tool_call') {
      return (
        <Box key={`thinking-${index}`} flexDirection="column" marginLeft={2} marginBottom={1}>
          <Text color="yellow" dimColor>
            🤔 调用工具: <Text bold>{step.toolName}</Text>
          </Text>
          {step.args && (
            <Text color="gray" dimColor>
              参数: {JSON.stringify(step.args, null, 2).slice(0, 150)}
              {JSON.stringify(step.args).length > 150 ? '...' : ''}
            </Text>
          )}
        </Box>
      );
    } else if (step.type === 'tool_result') {
      return (
        <Box key={`thinking-${index}`} flexDirection="column" marginLeft={2} marginBottom={1}>
          <Text color="blue" dimColor>
            ✓ 工具结果:
          </Text>
          <Text color="gray" dimColor>
            {step.result?.slice(0, 200)}
            {(step.result?.length || 0) > 200 ? '...' : ''}
          </Text>
        </Box>
      );
    } else if (step.type === 'reasoning') {
      return (
        <Box key={`thinking-${index}`} flexDirection="column" marginLeft={2} marginBottom={1}>
          <Text color="magenta" dimColor>
            💭 思考: {step.content}
          </Text>
        </Box>
      );
    }
    return null;
  };

  const renderMessage = (message: BaseMessage, index: number) => {
    if (message instanceof HumanMessage) {
      return (
        <Box key={index} flexDirection="column" marginBottom={1}>
          <Text color="cyan" bold>
            You:
          </Text>
          <Text>{message.content as string}</Text>
        </Box>
      );
    } else if (message instanceof AIMessage) {
      return (
        <Box key={index} flexDirection="column" marginBottom={1}>
          <Text color="green" bold>
            Assistant:
          </Text>
          <Text>{message.content as string}</Text>
          {message.tool_calls && message.tool_calls.length > 0 && (
            <Box flexDirection="column" marginTop={1}>
              {message.tool_calls.map((toolCall: any, i: number) => (
                <Text key={i} color="yellow">
                  🔧 {toolCall.name}({JSON.stringify(toolCall.args).slice(0, 50)}...)
                </Text>
              ))}
            </Box>
          )}
        </Box>
      );
    } else if (message instanceof ToolMessage) {
      return (
        <Box key={index} flexDirection="column" marginBottom={1}>
          <Text color="gray" dimColor>
            Tool Result:
          </Text>
          <Text dimColor>{(message.content as string).slice(0, 200)}</Text>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box flexDirection="column" height="100%">
      <Box flexDirection="column" flexGrow={1} paddingX={1} paddingY={1}>
        {messages.map((msg, idx) => renderMessage(msg, idx))}
        {isGenerating && thinkingSteps.length > 0 && (
          <Box flexDirection="column" marginTop={1} borderStyle="round" borderColor="gray" paddingX={1}>
            <Text color="yellow" bold>
              🧠 AI思考过程:
            </Text>
            {thinkingSteps.map((step, idx) => renderThinkingStep(step, idx))}
          </Box>
        )}
        {isGenerating && thinkingSteps.length === 0 && (
          <Box marginTop={1}>
            <Text color="yellow">⏳ Generating...</Text>
          </Box>
        )}
      </Box>
      <Box borderStyle="single" borderColor="gray" paddingX={1}>
        <Text color="cyan">{'> '}</Text>
        {!isGenerating && (
          <TextInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            placeholder="Type your message..."
          />
        )}
        {isGenerating && <Text color="gray">Generating...</Text>}
      </Box>
    </Box>
  );
};
