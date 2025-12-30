#!/usr/bin/env node
import { config } from 'dotenv';
import { setupYargs } from './cli/yargs-config.js';

config();

setupYargs(process.argv).parse();
