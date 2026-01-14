import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { project } from '../project.js';
import {
  startCommand,
  listCommand,
  switchCommand,
  deleteCommand,
  infoCommand,
} from './index.js';

export function setupYargs(argv: string[]) {
  return yargs(hideBin(argv))
    .scriptName('deer-code')
    .usage('$0 <command> [options]')
    .version('0.1.0')
    .command(
      ['start [dir]', '$0 [dir]'],
      'Start the AI coding assistant',
      (yargs) => {
        return yargs
          .positional('dir', {
            describe: 'Project directory',
            type: 'string',
            default: process.cwd(),
          })
          .option('new', {
            alias: 'n',
            describe: 'Create a new session',
            type: 'boolean',
            default: false,
          })
          .option('name', {
            describe: 'User name for the session',
            type: 'string',
          });
      },
      async (argv) => {
        if (argv.dir) {
          project.rootDir = argv.dir;
        }
        await startCommand({
          new: argv.new,
          name: argv.name,
        });
      }
    )
    .command(
      'list',
      'List all sessions',
      () => {},
      () => {
        listCommand();
      }
    )
    .command(
      'switch <sessionId>',
      'Switch to a different session',
      (yargs) => {
        return yargs.positional('sessionId', {
          describe: 'Session ID to switch to',
          type: 'string',
          demandOption: true,
        });
      },
      (argv) => {
        switchCommand(argv.sessionId as string);
      }
    )
    .command(
      'delete <sessionId>',
      'Delete a session',
      (yargs) => {
        return yargs
          .positional('sessionId', {
            describe: 'Session ID to delete',
            type: 'string',
            demandOption: true,
          })
          .option('force', {
            alias: 'f',
            describe: 'Force delete even if it is the current session',
            type: 'boolean',
            default: false,
          });
      },
      (argv) => {
        deleteCommand(argv.sessionId as string, argv.force);
      }
    )
    .command(
      'info',
      'Show current session information',
      () => {},
      () => {
        infoCommand();
      }
    )
    .help()
    .alias('h', 'help')
    .alias('v', 'version')
    .strict();
}
