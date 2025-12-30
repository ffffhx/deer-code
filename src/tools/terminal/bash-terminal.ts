import { spawn, IPty } from 'node-pty';
import os from 'os';

export class BashTerminal {
  private pty: IPty;
  private cwd: string;
  private outputBuffer: string = '';
  private prompt: string = 'BASH_TERMINAL_PROMPT> ';

  constructor(cwd?: string) {
    this.cwd = cwd || process.cwd();
    
    const shell = os.platform() === 'win32' ? 'powershell.exe' : '/bin/bash';
    
    this.pty = spawn(shell, [], {
      name: 'xterm-color',
      cols: 80,
      rows: 30,
      cwd: this.cwd,
      env: process.env as { [key: string]: string },
    });

    this.pty.onData((data) => {
      this.outputBuffer += data;
    });

    this.setupPrompt();
  }

  private setupPrompt(): void {
    this.pty.write(`PS1="${this.prompt}"\n`);
    this.waitForPrompt();
  }

  private waitForPrompt(timeout: number = 5000): Promise<void> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this.outputBuffer.includes(this.prompt)) {
          clearInterval(checkInterval);
          this.outputBuffer = '';
          resolve();
        } else if (Date.now() - startTime > timeout) {
          clearInterval(checkInterval);
          reject(new Error('Timeout waiting for prompt'));
        }
      }, 100);
    });
  }

  async execute(command: string, timeout: number = 30000): Promise<string> {
    this.outputBuffer = '';
    this.pty.write(`${command}\n`);

    await this.waitForPrompt(timeout);

    let output = this.outputBuffer;
    
    const lines = output.split('\n');
    if (lines.length > 0 && lines[0].trim() === command.trim()) {
      lines.shift();
    }

    output = lines
      .map((line) => line.replace(this.prompt, '').trim())
      .join('\n')
      .trim();

    output = output.replace(/\x1b\[[0-9;]*m/g, '');

    return output;
  }

  async getcwd(): Promise<string> {
    const result = await this.execute('pwd');
    return result.trim();
  }

  close(): void {
    if (this.pty) {
      this.pty.kill();
    }
  }
}
