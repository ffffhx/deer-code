// 运行Context7测试的简单脚本
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

async function runTest() {
  try {
    console.log('Running Context7 React Hooks test...');
    
    // 检查Node.js版本
    const { stdout: nodeVersion } = await execAsync('node --version');
    console.log(`Node.js version: ${nodeVersion.trim()}`);
    
    // 运行测试脚本
    const { stdout, stderr } = await execAsync('node test-context7-react-hooks.js');
    
    if (stdout) {
      console.log('Output:', stdout);
    }
    
    if (stderr) {
      console.error('Errors:', stderr);
    }
    
  } catch (error) {
    console.error('Error running test:', error.message);
    
    // 尝试直接运行
    console.log('\nTrying direct execution...');
    try {
      const testModule = require('./test-context7-react-hooks.js');
    } catch (e) {
      console.error('Direct execution failed:', e.message);
    }
  }
}

runTest();