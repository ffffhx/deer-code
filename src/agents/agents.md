# Agents 模块

## 概述

`agents` 模块是 DeerCode 的核心 AI Agent 实现，基于 LangChain 的 ReAct Agent 模式构建。它负责处理用户输入、调用工具、管理上下文，并生成 AI 响应。

## 文件结构

```
agents/
├── coding-agent.ts    # 主 Agent 实现
├── state.ts           # Agent 状态类型定义
└── index.ts           # 模块导出
```

## 核心组件

### CodingAgent (coding-agent.ts)

主要的 AI Agent 类，封装了整个对话和工具调用逻辑。

**关键职责：**

1. **模型初始化** - 通过 `initChatModel()` 初始化 ChatOpenAI 模型
2. **工具注册** - 集成内置工具（bash、grep、ls、textEditor、todoWrite、tree）和 MCP 外部工具
3. **上下文管理** - 使用 `ContextManager` 管理对话历史和 Token 压缩
4. **系统提示词构建** - 根据会话上下文动态生成系统提示词

**核心方法：**

- `constructor(pluginTools)` - 初始化 Agent，接收可选的插件工具
- `loadMCPTools()` - 懒加载 MCP 协议工具
- `getSystemPrompt(context)` - 根据上下文生成系统提示词
- `execute(context)` - 执行 Agent 对话循环，返回异步生成器用于流式输出
- `cleanup()` - 清理资源（上下文管理器、MCP 连接）

**执行流程：**

```
用户输入 → loadMCPTools() → manageContext() → createReactAgent() → stream() → 输出
```

### CodingAgentState (state.ts)

定义 Agent 的状态结构：

```typescript
interface CodingAgentState {
  messages: BaseMessage[];  // LangChain 消息数组
  todos: TodoItem[];        // TODO 列表
}
```

## 依赖关系

```
agents
├── models          # Chat 模型初始化
├── tools           # 内置工具集
├── context         # 上下文和 Token 管理
├── mcp             # MCP 外部工具加载
├── prompts         # 系统提示词构建
├── session         # 会话上下文
└── config          # 配置读取
```

## 使用方式

```typescript
import { CodingAgent } from './agents';

const agent = new CodingAgent();

// 执行对话
for await (const chunk of agent.execute(sessionContext)) {
  // 处理流式响应
  if (chunk.agent) { /* AI 消息 */ }
  if (chunk.tools) { /* 工具调用结果 */ }
}

// 清理
agent.cleanup();
```

## 设计要点

1. **ReAct 模式** - 使用 LangChain 的 `createReactAgent` 实现推理-行动循环
2. **流式输出** - 通过 `AsyncGenerator` 支持实时响应展示
3. **动态工具加载** - MCP 工具在首次执行时懒加载
4. **上下文压缩** - 当 Token 超过阈值时自动压缩历史消息
5. **递归限制** - `recursionLimit: 100` 防止无限工具调用循环
