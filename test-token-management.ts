import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';
import { TokenCounter } from './src/context/TokenCounter.js';
import { ContextManager } from './src/context/ContextManager.js';

async function testTokenManagement() {
  console.log('=== Testing Token Management ===\n');

  const tokenCounter = new TokenCounter('gpt-4');

  console.log('1. Testing TokenCounter:');
  const testText = 'Hello, this is a test message for token counting.';
  const tokens = tokenCounter.countTokens(testText);
  console.log(`   Text: "${testText}"`);
  console.log(`   Tokens: ${tokens}\n`);

  const messages = [
    new SystemMessage('You are a helpful assistant.'),
    new HumanMessage('Hello, how are you?'),
    new AIMessage('I am doing well, thank you!'),
    new HumanMessage('Can you help me with coding?'),
    new AIMessage('Of course! I would be happy to help you with coding.'),
  ];

  console.log('2. Testing message token counting:');
  const totalTokens = tokenCounter.countMessagesTokens(messages);
  console.log(`   Total messages: ${messages.length}`);
  console.log(`   Total tokens: ${totalTokens}\n`);

  const usage = tokenCounter.getUsage(messages);
  console.log('3. Testing token usage breakdown:');
  console.log(`   Input tokens: ${usage.inputTokens}`);
  console.log(`   Output tokens: ${usage.outputTokens}`);
  console.log(`   Total tokens: ${usage.totalTokens}\n`);

  console.log('4. Testing ContextManager:');
  const contextManager = new ContextManager({
    modelName: 'gpt-4',
    maxTokens: 1000,
    compressionThreshold: 0.8,
  });

  const longMessages = [
    new SystemMessage('You are a helpful coding assistant.'),
    ...Array.from({ length: 50 }, (_, i) => [
      new HumanMessage(`This is test message number ${i + 1}. Can you help me understand how to implement feature X?`),
      new AIMessage(`Sure! For message ${i + 1}, here's how you can implement feature X: First, you need to set up the basic structure. Then, add the necessary dependencies. Finally, implement the core logic with proper error handling.`),
    ]).flat(),
  ];

  console.log(`   Created ${longMessages.length} messages for testing`);
  const longTokens = contextManager.getTotalTokens(longMessages);
  console.log(`   Total tokens: ${longTokens}`);
  console.log(`   Should compress: ${contextManager.shouldCompress(longMessages)}\n`);

  console.log('5. Testing context management with compression:');
  const result = await contextManager.manageContext(longMessages);
  console.log(`   Compressed: ${result.compressed}`);
  console.log(`   Original message count: ${longMessages.length}`);
  console.log(`   Managed message count: ${result.messages.length}`);
  console.log(`   Token usage:`, result.usage);
  if (result.compressionResult) {
    console.log(`   Compression result:`, result.compressionResult);
  }

  tokenCounter.free();
  contextManager.cleanup();

  console.log('\n=== Test completed successfully! ===');
}

testTokenManagement().catch(console.error);
