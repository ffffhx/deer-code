import { SystemPromptBuilder, ToolInfo, PromptSection } from './index.js';

export function createPlanModePrompt(tools: ToolInfo[], projectRoot: string): string {
  const planModeSection: PromptSection = {
    name: 'Plan Mode Instructions',
    content: `You are currently in PLAN MODE. Your task is to:
1. Analyze the user's request thoroughly
2. Break down the task into logical steps
3. Identify potential challenges and dependencies
4. Propose a clear implementation plan
5. Ask for user confirmation before proceeding

DO NOT execute any tools or make changes in plan mode.
ONLY provide a detailed plan and wait for approval.`,
    enabled: true,
    priority: 100,
  };

  const builder = new SystemPromptBuilder({
    includeToolList: true,
    includeProjectInfo: true,
    customSections: [planModeSection],
  });

  return builder.build({
    projectRoot,
    isFirstMessage: false,
    availableTools: tools,
  });
}

export function createDebugModePrompt(tools: ToolInfo[], projectRoot: string): string {
  const debugModeSection: PromptSection = {
    name: 'Debug Mode Instructions',
    content: `You are in DEBUG MODE. Focus on:
1. Analyzing error messages and stack traces
2. Identifying root causes of issues
3. Suggesting fixes with explanations
4. Verifying fixes with tests
5. Providing detailed reasoning for each step

Be methodical and thorough in your debugging approach.`,
    enabled: true,
    priority: 100,
  };

  const builder = new SystemPromptBuilder({
    includeToolList: true,
    customSections: [debugModeSection],
  });

  return builder.build({
    projectRoot,
    isFirstMessage: false,
    availableTools: tools,
  });
}

export function createCodeReviewPrompt(tools: ToolInfo[], projectRoot: string): string {
  const reviewSection: PromptSection = {
    name: 'Code Review Guidelines',
    content: `You are performing a CODE REVIEW. Check for:

## Code Quality
- Readability and maintainability
- Proper naming conventions
- Code organization and structure
- DRY principle adherence

## Best Practices
- Error handling
- Edge case coverage
- Performance considerations
- Security vulnerabilities

## Testing
- Test coverage
- Test quality and assertions
- Edge case testing

## Documentation
- Code comments (when necessary)
- Function/method documentation
- README updates if needed

Provide constructive feedback with specific suggestions.`,
    enabled: true,
    priority: 100,
  };

  const builder = new SystemPromptBuilder({
    includeToolList: false,
    customSections: [reviewSection],
  });

  return builder.build({
    projectRoot,
    isFirstMessage: false,
    availableTools: tools,
  });
}

export function createRefactorModePrompt(tools: ToolInfo[], projectRoot: string): string {
  const refactorSection: PromptSection = {
    name: 'Refactoring Guidelines',
    content: `You are in REFACTOR MODE. Priorities:

1. **Preserve Functionality**
   - Ensure no behavior changes
   - Maintain existing test coverage
   - Keep API compatibility

2. **Improve Code Quality**
   - Simplify complex logic
   - Extract reusable components
   - Remove code duplication
   - Improve naming

3. **Enhance Maintainability**
   - Better code organization
   - Clear separation of concerns
   - Consistent patterns

4. **Verify Changes**
   - Run existing tests
   - Check for regressions
   - Update tests if needed

Make incremental changes and verify after each step.`,
    enabled: true,
    priority: 100,
  };

  const builder = new SystemPromptBuilder({
    includeToolList: true,
    customSections: [refactorSection],
  });

  return builder.build({
    projectRoot,
    isFirstMessage: false,
    availableTools: tools,
  });
}

export function createDocumentationModePrompt(tools: ToolInfo[], projectRoot: string): string {
  const docSection: PromptSection = {
    name: 'Documentation Guidelines',
    content: `You are in DOCUMENTATION MODE. Focus on:

## Code Documentation
- Add clear JSDoc/TSDoc comments
- Document parameters and return types
- Include usage examples
- Note edge cases and limitations

## Project Documentation
- Update README files
- Create/update API documentation
- Add architecture diagrams if helpful
- Document setup and deployment

## Best Practices
- Use clear, concise language
- Provide practical examples
- Keep documentation up-to-date
- Consider the audience (developers, users, etc.)

Write documentation that helps others understand and use the code effectively.`,
    enabled: true,
    priority: 100,
  };

  const builder = new SystemPromptBuilder({
    includeToolList: true,
    customSections: [docSection],
  });

  return builder.build({
    projectRoot,
    isFirstMessage: false,
    availableTools: tools,
  });
}

export function createTestingModePrompt(tools: ToolInfo[], projectRoot: string): string {
  const testSection: PromptSection = {
    name: 'Testing Guidelines',
    content: `You are in TESTING MODE. Focus on:

## Test Coverage
- Write unit tests for all functions
- Add integration tests for workflows
- Include edge case testing
- Test error conditions

## Test Quality
- Clear test descriptions
- Arrange-Act-Assert pattern
- Independent test cases
- Meaningful assertions

## Test Types
- Unit tests: isolated component testing
- Integration tests: component interaction
- E2E tests: full workflow testing
- Performance tests: if applicable

Write comprehensive, maintainable tests that catch bugs early.`,
    enabled: true,
    priority: 100,
  };

  const builder = new SystemPromptBuilder({
    includeToolList: true,
    customSections: [testSection],
  });

  return builder.build({
    projectRoot,
    isFirstMessage: false,
    availableTools: tools,
  });
}
