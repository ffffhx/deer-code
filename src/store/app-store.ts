import { create } from 'zustand';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import type { 
  AppState, 
  SessionState, 
  UIState, 
  Message, 
  Todo, 
  ThinkingStep,
  FocusId,
  ActiveModal 
} from './types.js';

export interface Store {
  app: AppState;
  session: SessionState;
  ui: UIState;

  setFocus: (focus: FocusId) => void;
  setActiveModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setTheme: (theme: string) => void;

  addUserMessage: (content: string) => void;
  addAssistantMessage: (content: string) => void;
  addToolMessage: (content: string) => void;
  updateStreamingBuffer: (buffer: string) => void;
  startStreaming: (messageId: string) => void;
  endStreaming: () => void;
  clearMessages: () => void;

  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  removeTodo: (id: string) => void;

  addThinkingStep: (step: ThinkingStep) => void;
  clearThinkingSteps: () => void;

  setTerminalSize: (width: number, height: number) => void;
  toggleTodoPanel: () => void;
  toggleHistoryExpanded: () => void;

  openFile: (path: string, content: string) => void;
  setActiveFile: (path: string | null) => void;
  addTerminalOutput: (output: string) => void;
  clearTerminalOutput: () => void;
  setIsGenerating: (isGenerating: boolean) => void;

  openFiles: Array<{ path: string; content: string }>;
  activeFilePath: string | null;
  terminalOutput: string[];
  isGenerating: boolean;
}

export const useAppStore = create<Store>((set) => ({
  app: {
    currentFocus: 'mainInput' as FocusId,
    activeModal: null,
    isProcessing: false,
    currentTheme: 'ayu-dark',
  },

  session: {
    sessionId: `session-${Date.now()}`,
    messages: [],
    displayMessages: [],
    todos: [],
    thinkingSteps: [],
    currentStreamingBuffer: '',
    currentStreamingMessageId: null,
  },

  ui: {
    terminalWidth: process.stdout.columns || 80,
    terminalHeight: process.stdout.rows || 24,
    showTodoPanel: false,
    historyExpanded: true,
  },

  openFiles: [],
  activeFilePath: null,
  terminalOutput: [],
  isGenerating: false,

  setFocus: (focus) =>
    set((state) => ({
      app: { ...state.app, currentFocus: focus },
    })),

  setActiveModal: (modal) =>
    set((state) => ({
      app: { ...state.app, activeModal: modal },
    })),

  closeModal: () =>
    set((state) => ({
      app: { ...state.app, activeModal: null },
    })),

  setIsProcessing: (isProcessing) =>
    set((state) => ({
      app: { ...state.app, isProcessing },
    })),

  setTheme: (theme) =>
    set((state) => ({
      app: { ...state.app, currentTheme: theme },
    })),

  addUserMessage: (content) =>
    set((state) => {
      const message = new HumanMessage(content);
      const displayMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      };
      return {
        session: {
          ...state.session,
          messages: [...state.session.messages, message],
          displayMessages: [...state.session.displayMessages, displayMessage],
        },
      };
    }),

  addAssistantMessage: (content) =>
    set((state) => {
      const message = new AIMessage(content);
      const displayMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content,
        timestamp: Date.now(),
      };
      return {
        session: {
          ...state.session,
          messages: [...state.session.messages, message],
          displayMessages: [...state.session.displayMessages, displayMessage],
        },
      };
    }),

  addToolMessage: (content) =>
    set((state) => {
      const displayMessage: Message = {
        id: `msg-${Date.now()}`,
        role: 'tool',
        content,
        timestamp: Date.now(),
        toolResult: content,
      };
      return {
        session: {
          ...state.session,
          displayMessages: [...state.session.displayMessages, displayMessage],
        },
      };
    }),

  updateStreamingBuffer: (buffer) =>
    set((state) => ({
      session: {
        ...state.session,
        currentStreamingBuffer: buffer,
      },
    })),

  startStreaming: (messageId) =>
    set((state) => ({
      session: {
        ...state.session,
        currentStreamingMessageId: messageId,
        currentStreamingBuffer: '',
      },
    })),

  endStreaming: () =>
    set((state) => {
      const { currentStreamingBuffer, currentStreamingMessageId } = state.session;
      if (currentStreamingBuffer && currentStreamingMessageId) {
        const message = new AIMessage(currentStreamingBuffer);
        const displayMessage: Message = {
          id: currentStreamingMessageId,
          role: 'assistant',
          content: currentStreamingBuffer,
          timestamp: Date.now(),
        };
        return {
          session: {
            ...state.session,
            messages: [...state.session.messages, message],
            displayMessages: [...state.session.displayMessages, displayMessage],
            currentStreamingBuffer: '',
            currentStreamingMessageId: null,
          },
        };
      }
      return {
        session: {
          ...state.session,
          currentStreamingBuffer: '',
          currentStreamingMessageId: null,
        },
      };
    }),

  clearMessages: () =>
    set((state) => ({
      session: {
        ...state.session,
        messages: [],
        displayMessages: [],
      },
    })),

  setTodos: (todos) =>
    set((state) => ({
      session: {
        ...state.session,
        todos,
      },
    })),

  addTodo: (todo) =>
    set((state) => ({
      session: {
        ...state.session,
        todos: [...state.session.todos, todo],
      },
    })),

  updateTodo: (id, updates) =>
    set((state) => ({
      session: {
        ...state.session,
        todos: state.session.todos.map((todo) =>
          todo.id === id ? { ...todo, ...updates } : todo
        ),
      },
    })),

  removeTodo: (id) =>
    set((state) => ({
      session: {
        ...state.session,
        todos: state.session.todos.filter((todo) => todo.id !== id),
      },
    })),

  addThinkingStep: (step) =>
    set((state) => ({
      session: {
        ...state.session,
        thinkingSteps: [...state.session.thinkingSteps, step],
      },
    })),

  clearThinkingSteps: () =>
    set((state) => ({
      session: {
        ...state.session,
        thinkingSteps: [],
      },
    })),

  setTerminalSize: (width, height) =>
    set((state) => ({
      ui: {
        ...state.ui,
        terminalWidth: width,
        terminalHeight: height,
      },
    })),

  toggleTodoPanel: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        showTodoPanel: !state.ui.showTodoPanel,
      },
    })),

  toggleHistoryExpanded: () =>
    set((state) => ({
      ui: {
        ...state.ui,
        historyExpanded: !state.ui.historyExpanded,
      },
    })),

  openFile: (path, content) =>
    set((state) => {
      const existingIndex = state.openFiles.findIndex((f) => f.path === path);
      if (existingIndex >= 0) {
        const newFiles = [...state.openFiles];
        newFiles[existingIndex] = { path, content };
        return {
          openFiles: newFiles,
          activeFilePath: path,
        };
      }
      return {
        openFiles: [...state.openFiles, { path, content }],
        activeFilePath: path,
      };
    }),

  setActiveFile: (path) =>
    set({
      activeFilePath: path,
    }),

  addTerminalOutput: (output) =>
    set((state) => ({
      terminalOutput: [...state.terminalOutput, output],
    })),

  clearTerminalOutput: () =>
    set({
      terminalOutput: [],
    }),

  setIsGenerating: (isGenerating) =>
    set({
      isGenerating,
    }),
}));
