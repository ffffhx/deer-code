export interface PromptContext {
  userName?: string;
  projectRoot: string;
  isFirstMessage: boolean;
  availableTools: ToolInfo[];
  mcpTools?: ToolInfo[];
  customInstructions?: string;
}

export interface ToolInfo {
  name: string;
  description: string;
  category?: 'builtin' | 'mcp' | 'custom';
}

export interface PromptSection {
  name: string;
  content: string;
  enabled: boolean;
  priority: number;
}

export interface SystemPromptConfig {
  includeToolList?: boolean;
  includeProjectInfo?: boolean;
  includeUserInfo?: boolean;
  customSections?: PromptSection[];
}
