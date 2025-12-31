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
import { ContextManager } from '../context/index.js';
import { getConfigSection } from '../config/index.js';

export class CodingAgent {
  private model: ChatOpenAI;
  private tools: any[];
  private contextManager: ContextManager;

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

    const settings = getConfigSection(['models', 'chat_model']);
    const modelName = settings?.model || 'gpt-4';
    const maxTokens = settings?.max_tokens || 100000;
    const compressionThreshold = settings?.compression_threshold || 0.8;

    this.contextManager = new ContextManager({
      modelName,
      maxTokens,
      compressionThreshold,
      chatModel: this.model,
    });
  }

  private getSystemPrompt(context: SessionContext): string {
    const userInfo = context.userName ? `User Name: ${context.userName}\n` : '';
    const isFirstMessage = context.messages.length === 0;
    
    const basePrompt = `You are a powerful AI coding assistant. You help users with software engineering tasks.

${userInfo}Project Root Directory: ${project.rootDir}

You have access to the following tools:
- bash: Execute bash commands
- grep: Search for patterns in files
- ls: List files and directories
- tree: Display directory structure
- text_editor: View and edit files
- todo_write: Manage TODO items

Always be helpful, accurate, and follow best practices.`;

    if (isFirstMessage) {
      return `${basePrompt}

IMPORTANT: When greeting the user for the first time, you may briefly introduce yourself and your capabilities. However, DO NOT repeat information about your context length, token limits, or tool environment limitations in subsequent conversations unless specifically asked by the user.`;
    }
    
    return `${basePrompt}

IMPORTANT: DO NOT repeat information about your context length, token limits, model name, or tool environment limitations unless specifically asked by the user. Focus on helping with the current task.`;
  }

  async *execute(context: SessionContext): AsyncGenerator<any, void, unknown> {
    const managedContext = await this.contextManager.manageContext(
      context.messages
    );

    context.tokenUsage = managedContext.usage;

    if (managedContext.compressed && managedContext.compressionResult) {
      context.compressionCount = (context.compressionCount || 0) + 1;
      console.log(
        `\n[Context Compression] Compressed ${managedContext.compressionResult.originalCount} messages to ${managedContext.compressionResult.compressedCount}, saved ${managedContext.compressionResult.tokensSaved} tokens\n`
      );
    }

    const agent = createReactAgent({
      llm: this.model,
      tools: this.tools,
      messageModifier: this.getSystemPrompt(context),
    });

    const stream = await agent.stream(
      { messages: managedContext.messages },
      { recursionLimit: 100 }
    );

    for await (const chunk of stream) {
      yield chunk;
    }
  }

  cleanup(): void {
    this.contextManager.cleanup();
  }
}
