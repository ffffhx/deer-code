import React, { useState, useEffect } from 'react';
import { Box, Text, useApp, useInput } from 'ink';
import { HumanMessage } from '@langchain/core/messages';
import { useAppStore } from '../store/index.js';
import { CodingAgent } from '../agents/coding-agent.js';
import { SessionManager, SessionContext } from '../session/index.js';
import { ChatView, EditorView, TerminalView, TodoView } from './components/index.js';

export const App: React.FC = () => {
  const { exit } = useApp();
  const [activePanel, setActivePanel] = useState<'terminal' | 'todo'>('terminal');
  
  const {
    openFiles,
    activeFilePath,
    terminalOutput,
    isGenerating,
    addTerminalOutput,
    setIsGenerating,
  } = useAppStore();

  const [sessionManager] = useState(() => new SessionManager());
  const [agent] = useState(() => new CodingAgent());
  const [sessionContext, setSessionContext] = useState<SessionContext>(() => 
    sessionManager.getCurrentSession()
  );

  useEffect(() => {
    const context = sessionManager.getCurrentSession();
    setSessionContext(context);
  }, [sessionManager]);

  useInput((input, key) => {
    if (input === 'q' && !isGenerating) {
      exit();
    }
    if (key.tab) {
      setActivePanel((prev) => (prev === 'terminal' ? 'todo' : 'terminal'));
    }
  });

  const handleUserMessage = async (userInput: string) => {
    if (userInput === 'exit' || userInput === 'quit') {
      exit();
      return;
    }

    const userMessage = new HumanMessage(userInput);
    
    const updatedContext: SessionContext = {
      ...sessionContext,
      messages: [...sessionContext.messages, userMessage],
    };
    setSessionContext(updatedContext);
    setIsGenerating(true);

    try {
      const stream = agent.execute(updatedContext);

      const newMessages = [...updatedContext.messages];

      for await (const chunk of stream) {
        if (chunk.agent) {
          const agentMessages = chunk.agent.messages || [];
          agentMessages.forEach((msg: any) => {
            newMessages.push(msg);
            
            if (msg.tool_calls) {
              msg.tool_calls.forEach((toolCall: any) => {
                if (toolCall.name === 'bash' || toolCall.name === 'tree' || toolCall.name === 'grep' || toolCall.name === 'ls') {
                  addTerminalOutput(`$ ${toolCall.name} ${JSON.stringify(toolCall.args)}`);
                } else if (toolCall.name === 'todo_write') {
                  const updatedTodos = toolCall.args.todos;
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
          });
        }
        
        if (chunk.tools) {
          const toolMessages = chunk.tools.messages || [];
          toolMessages.forEach((msg: any) => {
            newMessages.push(msg);
            if (msg.content && typeof msg.content === 'string') {
              const lines = msg.content.split('\n').slice(0, 5);
              addTerminalOutput(lines.join('\n'));
            }
          });
        }
      }

      const finalContext: SessionContext = {
        ...sessionContext,
        messages: newMessages,
      };
      setSessionContext(finalContext);
      sessionManager.saveSession(finalContext);
    } catch (error) {
      addTerminalOutput(`Error: ${error}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="double" borderColor="cyan" paddingX={1}>
        <Text bold color="cyan">
          🦌 DeerCode - AI Coding Assistant
        </Text>
        <Text color="gray"> | Press 'q' to quit | Tab to switch panels</Text>
      </Box>
      
      <Box flexGrow={1}>
        <Box width="40%" borderStyle="single" borderColor="gray">
          <ChatView
            messages={sessionContext.messages}
            isGenerating={isGenerating}
            onSubmit={handleUserMessage}
          />
        </Box>
        
        <Box flexDirection="column" flexGrow={1}>
          <Box height="60%" borderStyle="single" borderColor="blue">
            <EditorView openFiles={openFiles} activeFilePath={activeFilePath} />
          </Box>
          
          <Box flexGrow={1} borderStyle="single" borderColor={activePanel === 'terminal' ? 'green' : 'gray'}>
            {activePanel === 'terminal' ? (
              <TerminalView output={terminalOutput} />
            ) : (
              <TodoView todos={sessionContext.todos} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
