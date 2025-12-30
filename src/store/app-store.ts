import { create } from 'zustand';

export interface OpenFile {
  path: string;
  content: string;
}

interface AppState {
  openFiles: OpenFile[];
  activeFilePath: string | null;
  terminalOutput: string[];
  isGenerating: boolean;

  openFile: (path: string, content: string) => void;
  setActiveFile: (path: string | null) => void;
  addTerminalOutput: (output: string) => void;
  clearTerminalOutput: () => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  openFiles: [],
  activeFilePath: null,
  terminalOutput: [],
  isGenerating: false,

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
