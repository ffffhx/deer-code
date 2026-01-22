export interface StartupMessage {
  type: 'info' | 'error' | 'warning';
  message: string;
  timestamp: number;
}

class StartupLogger {
  private messages: StartupMessage[] = [];
  private listeners: Array<(messages: StartupMessage[]) => void> = [];

  log(message: string, type: 'info' | 'error' | 'warning' = 'info'): void {
    this.messages.push({
      type,
      message,
      timestamp: Date.now(),
    });
    this.notifyListeners();
  }

  getMessages(): StartupMessage[] {
    return [...this.messages];
  }

  clear(): void {
    this.messages = [];
    this.notifyListeners();
  }

  subscribe(listener: (messages: StartupMessage[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener([...this.messages]));
  }
}

export const startupLogger = new StartupLogger();
