const { spawn } = require('child_process');

const child = spawn('npx', ['tsx', 'test-context7.js'], {
  stdio: 'inherit',
  cwd: '/Users/bytedance/Code/deer-code'
});

child.on('error', (error) => {
  console.error('Failed to start process:', error);
});

child.on('exit', (code) => {
  console.log(`Process exited with code ${code}`);
});