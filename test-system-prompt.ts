import { createSystemPrompt, SystemPromptBuilder, ToolInfo } from './src/prompts/index.js';

console.log('='.repeat(80));
console.log('System Prompt Module Test');
console.log('='.repeat(80));

const tools: ToolInfo[] = [
  { name: 'bash', description: 'Execute bash commands', category: 'builtin' },
  { name: 'grep', description: 'Search for patterns in files', category: 'builtin' },
  { name: 'ls', description: 'List files and directories', category: 'builtin' },
  { name: 'text_editor', description: 'View and edit files', category: 'builtin' },
  { name: 'mcp_context7', description: 'Query documentation', category: 'mcp' },
  { name: 'mcp_figma', description: 'Access Figma designs', category: 'mcp' },
];

console.log('\n1. Basic Usage - First Message');
console.log('-'.repeat(80));
const basicPrompt = createSystemPrompt({
  userName: 'TestUser',
  projectRoot: '/Users/test/project',
  isFirstMessage: true,
  availableTools: tools,
});
console.log(basicPrompt);

console.log('\n\n2. Basic Usage - Subsequent Message');
console.log('-'.repeat(80));
const subsequentPrompt = createSystemPrompt({
  projectRoot: '/Users/test/project',
  isFirstMessage: false,
  availableTools: tools,
});
console.log(subsequentPrompt.substring(0, 500) + '...\n[Truncated for brevity]');

console.log('\n\n3. Advanced Usage - Custom Configuration');
console.log('-'.repeat(80));
const builder = new SystemPromptBuilder({
  includeToolList: true,
  includeProjectInfo: true,
  includeUserInfo: true,
  customSections: [
    {
      name: 'Project Guidelines',
      content: `- Use TypeScript strict mode
- Follow ESLint rules
- Write unit tests for all functions
- Use async/await instead of promises`,
      enabled: true,
      priority: 10,
    },
    {
      name: 'Team Conventions',
      content: `- Use camelCase for variables
- Use PascalCase for classes
- Prefix interfaces with 'I'
- Add JSDoc comments for public APIs`,
      enabled: true,
      priority: 5,
    },
  ],
});

const advancedPrompt = builder.build({
  userName: 'Developer',
  projectRoot: '/Users/dev/awesome-project',
  isFirstMessage: false,
  availableTools: tools.slice(0, 3),
  customInstructions: 'Always prioritize code readability over performance unless specified',
});
console.log(advancedPrompt.substring(0, 500) + '...\n[Truncated for brevity]');

console.log('\n\n4. Dynamic Configuration Update');
console.log('-'.repeat(80));
console.log('Initial config:', JSON.stringify(builder.getConfig(), null, 2));

builder.updateConfig({
  includeToolList: false,
  customSections: [
    {
      name: 'Quick Mode',
      content: 'Provide concise answers without detailed explanations',
      enabled: true,
      priority: 100,
    },
  ],
});

console.log('\nUpdated config:', JSON.stringify(builder.getConfig(), null, 2));

const updatedPrompt = builder.build({
  projectRoot: '/Users/dev/project',
  isFirstMessage: false,
  availableTools: [],
});
console.log('\nUpdated prompt preview:');
console.log(updatedPrompt.substring(0, 500) + '...\n[Truncated for brevity]');

console.log('\n\n5. Minimal Configuration');
console.log('-'.repeat(80));
const minimalBuilder = new SystemPromptBuilder({
  includeToolList: false,
  includeProjectInfo: false,
  includeUserInfo: false,
});

const minimalPrompt = minimalBuilder.build({
  projectRoot: '/tmp',
  isFirstMessage: true,
  availableTools: [],
});
console.log(minimalPrompt.substring(0, 500) + '...\n[Truncated for brevity]');

console.log('\n' + '='.repeat(80));
console.log('Test completed successfully!');
console.log('='.repeat(80));
