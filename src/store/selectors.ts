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

export const useStoreActions = (): StoreActions => {
  const addUserMessage = useAppStore((state: Store) => state.addUserMessage);
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

  return {
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
    setActiveModal,
    closeModal,
  };
};
