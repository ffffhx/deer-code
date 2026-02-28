import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { useUI, useStoreActions } from '../store/index.js';
import { CodingAgent } from '../agents/coding-agent.js';
import { SessionManager } from '../session/index.js';
import { MessageArea, InputArea, TodoPanel } from './components/index.js';
import { startupLogger, StartupMessage } from '../utils/startup-logger.js';
import { themeManager } from './themes/index.js';
import { isSlashCommand, executeSlashCommand, SlashCommandContext } from './slash-commands/index.js';

export const App: React.FC = () => {
  const ui = useUI();
  const {
    addUserMessage,
    addSystemMessage,
    setIsProcessing,
    addThinkingStep,
    clearThinkingSteps,
    updateStreamingBuffer,
    startStreaming,
    endStreaming,
    setTodos,
    addTerminalOutput,
    setIsGenerating,
    clearMessages,
    toggleTodoPanel,
    setTheme,
    initSession,
    setMessages,
    getSessionContext,
  } = useStoreActions();

  const [sessionManager] = useState(() => new SessionManager());
  const [agent] = useState(() => new CodingAgent());
  const [_startupMessages, setStartupMessages] = useState<StartupMessage[]>(() => 
    startupLogger.getMessages()
  );
  const [_showStartupMessages, setShowStartupMessages] = useState(true);

  const theme = themeManager.getTheme();

  useEffect(() => {
    const session = sessionManager.getCurrentSession();
    initSession(session);
  }, []);

  useEffect(() => {
    const unsubscribe = startupLogger.subscribe((messages) => {
      setStartupMessages(messages);
    });
    
    const hideTimer = setTimeout(() => {
      setShowStartupMessages(false);
    }, 5000);
    
    return () => {
      unsubscribe();
      clearTimeout(hideTimer);
    };
  }, []);

  const slashCommandContext: SlashCommandContext = {
    clearMessages,
    toggleTodoPanel,
    setTheme: (themeName: string) => {
      setTheme(themeName);
      themeManager.setTheme(themeName);
    },
    exitApp: () => process.exit(0),
  };

  const handleUserMessage = async (userInput: string) => {
    if (userInput === 'q' || userInput === 'exit' || userInput === 'quit') {
      process.exit(0);
    }

    if (isSlashCommand(userInput)) {
      const result = executeSlashCommand(userInput, slashCommandContext);
      
      if (result.message) {
        addSystemMessage(result.message);
      }
      if (result.action === 'exit') {
        setTimeout(() => process.exit(0), 100);
      }
      return;
    }

    addUserMessage(userInput);
    
    setIsProcessing(true);
    setIsGenerating(true);
    clearThinkingSteps();

    const streamingId = `msg-${Date.now()}`;
    // 标记流式响应开始
    startStreaming(streamingId);

    try {
      const currentContext = getSessionContext();
      const stream = agent.execute(currentContext);

      const newMessages = [...currentContext.messages];
      let streamBuffer = '';

      for await (const chunk of stream) {
        console.log('Received chunk:', chunk);
        // 处理agent消息
        if (chunk.agent) {
          const agentMessages = chunk.agent.messages || [];
          agentMessages.forEach((msg: any) => {
            newMessages.push(msg);
            
            // 工具调用请求
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
                  setMessages(newMessages);
                  const updatedContext = getSessionContext();
                  sessionManager.saveSession(updatedContext);
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
        
        // 处理工具执行结果
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

      setMessages(newMessages);
      const finalContext = getSessionContext();
      sessionManager.saveSession(finalContext);
    } catch (error) {
      addTerminalOutput(`Error: ${error}`);
      endStreaming();
    } finally {
      setIsProcessing(false);
      setIsGenerating(false);
      // clearThinkingSteps();
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="single" borderColor={theme.colors.accent} paddingX={1}>
        <Text bold color={theme.colors.accent}>
           DeerCode - AI Coding Assistant
        </Text>
        <Text color={theme.colors.text.muted}> 开发中 </Text>
      </Box>   
      <Box flexGrow={1} flexDirection="column">
        <MessageArea />
        {ui.showTodoPanel && <TodoPanel />}
      </Box>
      <InputArea onSubmit={handleUserMessage} />
    </Box>
  );
};
