import { useAppStore, type Store } from './app-store.js';
import type { AppState, SessionState, UIState, Todo, ThinkingStep, ActiveModal } from './types.js';
import type { BaseMessage } from '@langchain/core/messages';
import type { SessionContext } from '../session/index.js';
import type { TokenUsage } from '../context/index.js';

export const useApp = (): AppState => useAppStore((state: Store) => state.app);
export const useSession = (): SessionState => useAppStore((state: Store) => state.session);
export const useUI = (): UIState => useAppStore((state: Store) => state.ui);

export const useIsProcessing = (): boolean => useAppStore((state: Store) => state.app.isProcessing);
export const useActiveModal = (): ActiveModal => useAppStore((state: Store) => state.app.activeModal);
export const useCurrentTheme = (): string => useAppStore((state: Store) => state.app.currentTheme);

export const useMessages = () => useAppStore((state: Store) => state.session.displayMessages);
export const useTodos = (): Todo[] => useAppStore((state: Store) => state.session.todos);
export const useThinkingSteps = (): ThinkingStep[] => useAppStore((state: Store) => state.session.thinkingSteps);
export const useStreamingBuffer = (): string => useAppStore((state: Store) => state.session.currentStreamingBuffer);

export const useShowTodoPanel = (): boolean => useAppStore((state: Store) => state.ui.showTodoPanel);

export const useSessionMessages = (): BaseMessage[] => useAppStore((state: Store) => state.session.messages);
export const useSessionContext = (): SessionContext => useAppStore((state: Store) => state.getSessionContext());
export const useTokenUsage = (): TokenUsage | undefined => useAppStore((state: Store) => state.session.tokenUsage);

export interface StoreActions {
  addUserMessage: (content: string) => void;
  addSystemMessage: (content: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  addThinkingStep: (step: ThinkingStep) => void;
  clearThinkingSteps: () => void;
  updateStreamingBuffer: (buffer: string) => void;
  startStreaming: (messageId: string) => void;
  endStreaming: () => void;
  setTodos: (todos: Todo[]) => void;
  addTerminalOutput: (output: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setActiveModal: (modal: ActiveModal) => void;
  closeModal: () => void;
  clearMessages: () => void;
  toggleTodoPanel: () => void;
  setTheme: (theme: string) => void;
  initSession: (context: SessionContext) => void;
  addMessage: (message: BaseMessage) => void;
  setMessages: (messages: BaseMessage[]) => void;
  setTokenUsage: (usage: TokenUsage) => void;
  setCompressionCount: (count: number) => void;
  getSessionContext: () => SessionContext;
}

export const useStoreActions = (): StoreActions => {
  const addUserMessage = useAppStore((state: Store) => state.addUserMessage);
  const addSystemMessage = useAppStore((state: Store) => state.addSystemMessage);
  const setIsProcessing = useAppStore((state: Store) => state.setIsProcessing);
  const addThinkingStep = useAppStore((state: Store) => state.addThinkingStep);
  const clearThinkingSteps = useAppStore((state: Store) => state.clearThinkingSteps);
  const updateStreamingBuffer = useAppStore((state: Store) => state.updateStreamingBuffer);
  const startStreaming = useAppStore((state: Store) => state.startStreaming);
  const endStreaming = useAppStore((state: Store) => state.endStreaming);
  const setTodos = useAppStore((state: Store) => state.setTodos);
  const addTerminalOutput = useAppStore((state: Store) => state.addTerminalOutput);
  const setIsGenerating = useAppStore((state: Store) => state.setIsGenerating);
  const setActiveModal = useAppStore((state: Store) => state.setActiveModal);
  const closeModal = useAppStore((state: Store) => state.closeModal);
  const clearMessages = useAppStore((state: Store) => state.clearMessages);
  const toggleTodoPanel = useAppStore((state: Store) => state.toggleTodoPanel);
  const setTheme = useAppStore((state: Store) => state.setTheme);
  const initSession = useAppStore((state: Store) => state.initSession);
  const addMessage = useAppStore((state: Store) => state.addMessage);
  const setMessages = useAppStore((state: Store) => state.setMessages);
  const setTokenUsage = useAppStore((state: Store) => state.setTokenUsage);
  const setCompressionCount = useAppStore((state: Store) => state.setCompressionCount);
  const getSessionContext = useAppStore((state: Store) => state.getSessionContext);

  return {
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
    setActiveModal,
    closeModal,
    clearMessages,
    toggleTodoPanel,
    setTheme,
    initSession,
    addMessage,
    setMessages,
    setTokenUsage,
    setCompressionCount,
    getSessionContext,
  };
};
