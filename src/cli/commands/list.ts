import { SessionManager } from '../../session/index.js';
import chalk from 'chalk';

export function listCommand(): void {
  const sessionManager = new SessionManager();
  const sessions = sessionManager.listSessions();
  const currentSessionId = sessionManager.getCurrentSessionId();

  if (sessions.length === 0) {
    console.log(chalk.yellow('No sessions found.'));
    return;
  }

  console.log(chalk.bold.cyan('\n📋 Sessions:\n'));

  sessions.forEach((session) => {
    const isCurrent = session.sessionId === currentSessionId;
    const marker = isCurrent ? chalk.green('→ ') : '  ';
    const userName = session.userName ? chalk.blue(`[${session.userName}]`) : '';
    const date = new Date(session.updatedAt).toLocaleString();

    console.log(
      `${marker}${chalk.bold(session.sessionId)} ${userName}`
    );
    console.log(
      `  ${chalk.gray(`Messages: ${session.messageCount} | Updated: ${date}`)}`
    );
    console.log();
  });
}
