#!/usr/bin/env node
import { config } from 'dotenv';
import { setupYargs } from './dist/cli/yargs-config.js';

config();

// 模拟命令行参数：开启新会话
const args = process.argv.slice(0, 2); // 保留 node 和脚本名
args.push('--new'); // 添加 --new 参数

console.log('启动 deer-code 新会话...');
console.log('参数:', args);

setupYargs(args).parse();