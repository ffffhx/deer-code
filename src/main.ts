#!/usr/bin/env node
import { config } from 'dotenv';
import { setupYargs } from './commands/yargs-config.js';

config();

setupYargs(process.argv).parse();
