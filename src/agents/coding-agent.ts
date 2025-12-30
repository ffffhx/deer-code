import { ChatOpenAI } from '@langchain/openai';
import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { initChatModel } from '../models/index.js';
import { project } from '../project.js';
import {
  bashTool,
  grepTool,
  lsTool,
  textEditorTool,
  todoWriteTool,
  treeTool,
} from '../tools/index.js';
import { SessionContext } from '../session/index.js';

export class CodingAgent {
  private model: ChatOpenAI;
  private tools: any[];

  constructor(pluginTools: any[] = []) {
    this.model = initChatModel() as ChatOpenAI;
    this.tools = [
      bashTool,
      grepTool,
      lsTool,
      textEditorTool,
      todoWriteTool,
      treeTool,
      ...pluginTools,
    ];
  }

  private getSystemPrompt(context: SessionContext): string {
    const userInfo = context.userName ? `User Name: ${context.userName}\n` : '';
    return `You are a powerful AI coding assistant. You help users with software engineering tasks.

${userInfo}Project Root Directory: ${project.rootDir}

You have access to the following tools:
- bash: Execute bash commands
- grep: Search for patterns in files
- ls: List files and directories
- tree: Display directory structure
- text_editor: View and edit files
- todo_write: Manage TODO items

Always be helpful, accurate, and follow best practices.`;
  }

  async *execute(context: SessionContext): AsyncGenerator<any, void, unknown> {
    const agent = createReactAgent({
      llm: this.model,
      tools: this.tools,
      messageModifier: this.getSystemPrompt(context),
    });

    const stream = await agent.stream(
      { messages: context.messages },
      { recursionLimit: 100 }
    );

    for await (const chunk of stream) {
      yield chunk;
    }
  }
}
