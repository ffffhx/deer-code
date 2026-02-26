# Prompts 模块

## 概述

`prompts` 模块负责构建和管理 AI Agent 的系统提示词。采用模块化设计，支持动态组装不同类型的提示词段落。

## 文件结构

```
prompts/
├── system-prompt-builder.ts  # 提示词构建器
├── base-prompt.ts            # 基础提示词
├── context-prompt.ts         # 上下文相关提示词
├── tool-prompt.ts            # 工具相关提示词
├── examples.ts               # 示例（如有）
├── types.ts                  # 类型定义
├── README.md                 # 原有文档
└── index.ts                  # 模块导出
```

## 核心组件

### SystemPromptBuilder (system-prompt-builder.ts)

系统提示词构建器类，负责组装完整的系统提示词。

**配置选项：**

```typescript
interface SystemPromptConfig {
  includeToolList?: boolean;     // 是否包含工具列表
  includeProjectInfo?: boolean;  // 是否包含项目信息
  includeUserInfo?: boolean;     // 是否包含用户信息
  customSections?: PromptSection[]; // 自定义段落
}
```

**构建流程：**

```
BASE_SYSTEM_PROMPT
    ↓
+ 上下文信息（项目、用户）
    ↓
+ 工具列表 + 使用指南
    ↓
+ 环境信息
    ↓
+ 安全提示
    ↓
+ 自定义段落
    ↓
+ 自定义指令
    ↓
+ 首次/后续消息附加说明
```

### BASE_SYSTEM_PROMPT (base-prompt.ts)

定义 Agent 的核心行为规则：

- 核心能力描述
- 行为准则
- 代码风格要求
- 任务管理规则
- 工具使用指南
- 响应语言规则

**附加说明：**

- `FIRST_MESSAGE_ADDENDUM` - 首次消息时的问候说明
- `SUBSEQUENT_MESSAGE_ADDENDUM` - 后续消息时避免重复信息

### 上下文提示词 (context-prompt.ts)

生成上下文相关的提示词：

- `generateContextPrompt()` - 项目和用户信息
- `generateEnvironmentPrompt()` - 环境信息（OS、工作目录等）
- `generateSecurityPrompt()` - 安全相关提示

### 工具提示词 (tool-prompt.ts)

生成工具相关的提示词：

- `generateToolListPrompt()` - 可用工具列表
- `generateToolUsageGuidelines()` - 工具使用指南

### Types (types.ts)

```typescript
interface PromptContext {
  userName?: string;          // 用户名
  projectRoot?: string;       // 项目根目录
  isFirstMessage?: boolean;   // 是否首次消息
  availableTools: ToolInfo[]; // 可用工具列表
  customInstructions?: string; // 自定义指令
}

interface ToolInfo {
  name: string;
  description: string;
  category: 'builtin' | 'mcp';
}
```

## 依赖关系

```
prompts
└── (纯 TypeScript，无外部依赖)
```

## 使用方式

```typescript
import { createSystemPrompt, SystemPromptBuilder } from './prompts';

// 快速创建
const prompt = createSystemPrompt({
  userName: 'developer',
  projectRoot: '/path/to/project',
  isFirstMessage: true,
  availableTools: [
    { name: 'bash', description: 'Execute commands', category: 'builtin' },
  ],
});

// 使用构建器自定义
const builder = new SystemPromptBuilder({
  includeToolList: true,
  customSections: [
    { name: 'Custom Rules', content: '...', priority: 10, enabled: true },
  ],
});
const customPrompt = builder.build(context);
```

## 设计要点

1. **模块化** - 每种提示词类型独立文件，易于维护
2. **可配置** - 可选择包含/排除特定段落
3. **可扩展** - 支持添加自定义段落
4. **上下文感知** - 根据是否首次消息调整内容
5. **优先级排序** - 自定义段落按优先级排序插入
