import { useAppStore, type Store } from './app-store.js';
import type { AppState, SessionState, UIState, Todo, ThinkingStep, ActiveModal } from './types.js';

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

export interface StoreActions {
  addUserMessage: (content: string) => void;
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
}

export const useStoreActions = (): StoreActions => useAppStore((state: Store) => ({
  addUserMessage: state.addUserMessage,
  setIsProcessing: state.setIsProcessing,
  addThinkingStep: state.addThinkingStep,
  clearThinkingSteps: state.clearThinkingSteps,
  updateStreamingBuffer: state.updateStreamingBuffer,
  startStreaming: state.startStreaming,
  endStreaming: state.endStreaming,
  setTodos: state.setTodos,
  addTerminalOutput: state.addTerminalOutput,
  setIsGenerating: state.setIsGenerating,
  setActiveModal: state.setActiveModal,
  closeModal: state.closeModal,
}));
