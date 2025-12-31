#!/usr/bin/env node
import { config } from 'dotenv';
import { setupYargs } from './dist/cli/yargs-config.js';

config();

const argv = ['node', 'test.js', '--new'];
setupYargs(argv).parse();