# Context 模块

## 概述

`context` 模块负责管理 AI 对话的上下文，包括 Token 计数和智能压缩。当对话历史过长时，自动压缩中间消息以节省 Token。

## 文件结构

```
context/
├── ContextManager.ts   # 上下文管理器
├── TokenCounter.ts     # Token 计数器
└── index.ts            # 模块导出
```

## 核心组件

### ContextManager (ContextManager.ts)

管理对话上下文的主类，负责 Token 监控和消息压缩。

**配置参数：**

```typescript
interface ContextManagerConfig {
  maxTokens?: number;           // 最大 Token 数，默认 100000
  compressionThreshold?: number; // 压缩阈值，默认 0.8（即 80%）
  modelName?: string;           // 模型名称，用于 Token 计算
  chatModel?: ChatOpenAI;       // 用于智能压缩的模型
}
```

**核心方法：**

1. `getTokenUsage(messages)` - 获取消息的 Token 使用统计
2. `getTotalTokens(messages)` - 计算消息总 Token 数
3. `shouldCompress(messages)` - 判断是否需要压缩
4. `compressMessages(messages)` - 压缩消息历史
5. `manageContext(messages)` - 综合上下文管理入口

**压缩策略：**

```
消息列表 = [系统消息] + [历史消息...] + [最近10条消息]

压缩时：
1. 保留系统消息
2. 将中间的历史消息压缩为摘要
3. 保留最近 10 条消息不压缩
```

**智能压缩：**

- 优先使用 ChatModel 生成对话摘要
- 失败时回退到简单截断压缩

### TokenCounter (TokenCounter.ts)

基于 tiktoken 的 Token 计数器。

**功能：**

1. `countTokens(text)` - 计算文本 Token 数
2. `countMessageTokens(message)` - 计算单条消息 Token 数
3. `countMessagesTokens(messages)` - 计算消息列表总 Token 数
4. `getUsage(messages)` - 分类统计输入/输出 Token

**返回结构：**

```typescript
interface TokenUsage {
  inputTokens: number;   // 用户和系统消息的 Token
  outputTokens: number;  // AI 响应的 Token
  totalTokens: number;   // 总计
}
```

## 依赖关系

```
context
├── @langchain/core/messages  # 消息类型
├── @langchain/openai        # ChatOpenAI（用于智能压缩）
└── js-tiktoken              # Token 计算库
```

## 使用方式

```typescript
import { ContextManager } from './context';

const contextManager = new ContextManager({
  modelName: 'gpt-4',
  maxTokens: 100000,
  compressionThreshold: 0.8,
  chatModel: chatModel,
});

// 管理上下文
const result = await contextManager.manageContext(messages);

console.log(result.usage);        // Token 使用统计
console.log(result.compressed);   // 是否进行了压缩
console.log(result.messages);     // 处理后的消息列表

// 清理资源
contextManager.cleanup();
```

## 设计要点

1. **自动压缩** - 达到阈值时自动触发，无需手动干预
2. **保留关键信息** - 系统消息和最近对话不压缩
3. **智能摘要** - 使用 LLM 生成有意义的历史摘要
4. **降级策略** - 智能压缩失败时使用简单截断
5. **资源管理** - 提供 `cleanup()` 方法释放 tiktoken 编码器
