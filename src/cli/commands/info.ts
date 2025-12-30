import { SessionManager } from '../../session/index.js';
import chalk from 'chalk';

export function infoCommand(): void {
  const sessionManager = new SessionManager();
  const session = sessionManager.getCurrentSession();

  console.log(chalk.bold.cyan('\n📊 Current Session Info:\n'));
  console.log(`${chalk.bold('Session ID:')} ${session.sessionId}`);
  console.log(`${chalk.bold('User Name:')} ${session.userName || chalk.gray('(not set)')}`);
  console.log(`${chalk.bold('Messages:')} ${session.messages.length}`);
  console.log(`${chalk.bold('Todos:')} ${session.todos.length}`);
  console.log(`${chalk.bold('Created:')} ${new Date(session.createdAt).toLocaleString()}`);
  console.log(`${chalk.bold('Updated:')} ${new Date(session.updatedAt).toLocaleString()}`);
  console.log();
}
