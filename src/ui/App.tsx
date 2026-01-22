import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { HumanMessage } from '@langchain/core/messages';
import { useUI, useStoreActions } from '../store/index.js';
import { CodingAgent } from '../agents/coding-agent.js';
import { SessionManager, SessionContext } from '../session/index.js';
import { MessageArea, InputArea, StatusBar, TodoPanel } from './components/index.js';
import { startupLogger, StartupMessage } from '../utils/startup-logger.js';
import { themeManager } from './themes/index.js';

export const App: React.FC = () => {
  const ui = useUI();
  const {
    addUserMessage,
    setIsProcessing,
    addThinkingStep,
    clearThinkingSteps,
    updateStreamingBuffer,
    startStreaming,
    endStreaming,
    setTodos,
    addTerminalOutput,
    setIsGenerating,
  } = useStoreActions();

  const [sessionManager] = useState(() => new SessionManager());
  const [agent] = useState(() => new CodingAgent());
  const [sessionContext, setSessionContext] = useState<SessionContext>(() => 
    sessionManager.getCurrentSession()
  );
  const [startupMessages, setStartupMessages] = useState<StartupMessage[]>(() => 
    startupLogger.getMessages()
  );

  const theme = themeManager.getTheme();

  useEffect(() => {
    const context = sessionManager.getCurrentSession();
    setSessionContext(context);
  }, [sessionManager]);

  useEffect(() => {
    const unsubscribe = startupLogger.subscribe((messages) => {
      setStartupMessages(messages);
    });
    
    const clearTimer = setTimeout(() => {
      startupLogger.clear();
    }, 3000);
    
    return () => {
      unsubscribe();
      clearTimeout(clearTimer);
    };
  }, []);

  const handleUserMessage = async (userInput: string) => {
    if (userInput === 'q' || userInput === 'exit' || userInput === 'quit') {
      process.exit(0);
    }

    addUserMessage(userInput);
    const userMessage = new HumanMessage(userInput);
    
    const updatedContext: SessionContext = {
      ...sessionContext,
      messages: [...sessionContext.messages, userMessage],
    };
    setSessionContext(updatedContext);
    setIsProcessing(true);
    setIsGenerating(true);
    clearThinkingSteps();

    const streamingId = `msg-${Date.now()}`;
    startStreaming(streamingId);

    try {
      const stream = agent.execute(updatedContext);

      const newMessages = [...updatedContext.messages];
      let streamBuffer = '';

      for await (const chunk of stream) {
        if (chunk.agent) {
          const agentMessages = chunk.agent.messages || [];
          agentMessages.forEach((msg: any) => {
            newMessages.push(msg);
            
            if (msg.tool_calls) {
              msg.tool_calls.forEach((toolCall: any) => {
                addThinkingStep({
                  type: 'tool_call',
                  timestamp: Date.now(),
                  content: `Calling ${toolCall.name}`,
                  toolName: toolCall.name,
                  args: toolCall.args,
                });

                if (toolCall.name === 'bash' || toolCall.name === 'tree' || toolCall.name === 'grep' || toolCall.name === 'ls') {
                  addTerminalOutput(`$ ${toolCall.name} ${JSON.stringify(toolCall.args)}`);
                } else if (toolCall.name === 'todo_write') {
                  const updatedTodos = toolCall.args.todos;
                  setTodos(updatedTodos);
                  const finalContext: SessionContext = {
                    ...sessionContext,
                    messages: newMessages,
                    todos: updatedTodos,
                  };
                  setSessionContext(finalContext);
                  sessionManager.saveSession(finalContext);
                }
              });
            }

            if (msg.content && typeof msg.content === 'string' && msg.content.trim()) {
              streamBuffer += msg.content;
              updateStreamingBuffer(streamBuffer);
              
              addThinkingStep({
                type: 'reasoning',
                timestamp: Date.now(),
                content: msg.content.slice(0, 100),
              });
            }
          });
        }
        
        if (chunk.tools) {
          const toolMessages = chunk.tools.messages || [];
          toolMessages.forEach((msg: any) => {
            newMessages.push(msg);
            
            if (msg.content && typeof msg.content === 'string') {
              addThinkingStep({
                type: 'tool_result',
                timestamp: Date.now(),
                content: 'Tool returned result',
                result: msg.content,
              });

              const lines = msg.content.split('\n').slice(0, 5);
              addTerminalOutput(lines.join('\n'));
            }
          });
        }
      }

      endStreaming();

      const finalContext: SessionContext = {
        ...sessionContext,
        messages: newMessages,
      };
      setSessionContext(finalContext);
      sessionManager.saveSession(finalContext);
    } catch (error) {
      addTerminalOutput(`Error: ${error}`);
      endStreaming();
    } finally {
      setIsProcessing(false);
      setIsGenerating(false);
      clearThinkingSteps();
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="single" borderColor={theme.colors.accent} paddingX={1}>
        <Text bold color={theme.colors.accent}>
          🦌 DeerCode - AI Coding Assistant
        </Text>
        <Text color={theme.colors.text.muted}> | Press 'q' to quit</Text>
      </Box>
      
      {startupMessages.length > 0 && (
        <Box flexDirection="column" borderStyle="single" borderColor={theme.colors.border.light} paddingX={1} marginBottom={1}>
          {startupMessages.map((msg, index) => (
            <Text 
              key={index} 
              color={
                msg.type === 'error' 
                  ? theme.colors.error 
                  : msg.type === 'warning' 
                  ? theme.colors.warning 
                  : theme.colors.success
              }
            >
              {msg.message}
            </Text>
          ))}
        </Box>
      )}
      
      <Box flexGrow={1} flexDirection="column">
        <MessageArea />
        {ui.showTodoPanel && <TodoPanel />}
      </Box>

      <InputArea onSubmit={handleUserMessage} />
      <StatusBar />
    </Box>
  );
};
