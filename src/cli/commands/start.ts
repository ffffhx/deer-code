import React from 'react';
import { render } from 'ink';
import { App } from '../App.js';
import { SessionManager } from '../../session/index.js';

export interface StartOptions {
  new?: boolean;
  name?: string;
}

export function startCommand(options: StartOptions): void {
  const sessionManager = new SessionManager();

  if (options.new) {
    const context = sessionManager.createSession(options.name || null);
    console.log(`Created new session: ${context.sessionId}`);
  }

  render(React.createElement(App));
}
