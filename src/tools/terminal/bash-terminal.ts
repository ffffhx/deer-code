import { spawn, IPty } from 'node-pty';
import os from 'os';

// 实现了一个持久化的bash终端会话，使用node-pty库来创建和管理伪终端
export class BashTerminal {
  private pty: IPty; // 伪终端实例，伪终端是一个给程序用的模拟终端环境
  private cwd: string; // 当前工作目录
  private outputBuffer: string = ''; // 输出缓冲区，用于存储终端的输出
  private prompt: string = 'BASH_TERMINAL_PROMPT> '; // 自定义的命令提示符，用于 检测命令是否执行完毕

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

  // 用于等待命令执行完毕
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
