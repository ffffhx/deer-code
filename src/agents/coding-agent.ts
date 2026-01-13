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
import { getGlobalMCPManager, loadMCPTools } from '../mcp/index.js';
import { createSystemPrompt, ToolInfo } from '../prompts/index.js';

export class CodingAgent {
  private model: ChatOpenAI;
  private tools: any[];
  private contextManager: ContextManager;
  private mcpToolsLoaded = false;

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

  private async loadMCPTools(): Promise<void> {
    if (this.mcpToolsLoaded) {
      return;
    }

    try {
      const mcpManager = getGlobalMCPManager();
      if (mcpManager.getServerCount() > 0) {
        const mcpTools = await loadMCPTools(mcpManager);
        this.tools.push(...mcpTools);
        console.log(`[MCP] Loaded ${mcpTools.length} tools from MCP servers`);
      }
      this.mcpToolsLoaded = true;
    } catch (error) {
      console.error('[MCP] Failed to load MCP tools:', error);
    }
  }

  private getSystemPrompt(context: SessionContext): string {
    const isFirstMessage = context.messages.length === 0;
    
    const availableTools: ToolInfo[] = this.tools.map(tool => ({
      name: tool.name,
      description: tool.description || '',
      category: tool.name.startsWith('mcp_') ? 'mcp' : 'builtin',
    }));

    return createSystemPrompt({
      userName: context.userName || undefined,
      projectRoot: project.rootDir,
      isFirstMessage,
      availableTools,
    });
  }

  async *execute(context: SessionContext): AsyncGenerator<any, void, unknown> {
    await this.loadMCPTools();

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
    
    const mcpManager = getGlobalMCPManager();
    mcpManager.disconnectAll().catch((error) => {
      console.error('[MCP] Error during cleanup:', error);
    });
  }
}
