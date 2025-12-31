# Token管理与压缩

本文档介绍了deer-code项目中实现的token管理与压缩功能，该功能参考了飞书文档中4.8节的设计思路。

## 概述

Token管理与压缩是Coding Agent中的关键功能，用于：
- 统计和跟踪消息的token使用情况
- 当token数量超过阈值时自动压缩历史消息
- 保持上下文窗口在合理范围内，避免超出模型限制

## 核心组件

### 1. TokenCounter (src/context/TokenCounter.ts)

负责统计token数量的工具类。

**主要功能：**
- `countTokens(text: string)`: 统计文本的token数量
- `countMessageTokens(message: BaseMessage)`: 统计单条消息的token数量
- `countMessagesTokens(messages: BaseMessage[])`: 统计多条消息的总token数量
- `getUsage(messages: BaseMessage[])`: 获取详细的token使用情况（区分输入/输出）

**使用示例：**
```typescript
import { TokenCounter } from './src/context/TokenCounter.js';

const counter = new TokenCounter('gpt-4');
const tokens = counter.countTokens('Hello, world!');
console.log(`Tokens: ${tokens}`);

const usage = counter.getUsage(messages);
console.log(`Input: ${usage.inputTokens}, Output: ${usage.outputTokens}`);

counter.free();
```

### 2. ContextManager (src/context/ContextManager.ts)

管理消息历史和自动压缩的核心类。

**配置选项：**
```typescript
interface ContextManagerConfig {
  maxTokens?: number;              // 最大token数量，默认100000
  compressionThreshold?: number;   // 压缩阈值（0-1），默认0.8
  modelName?: string;              // 模型名称，默认'gpt-4'
  chatModel?: ChatOpenAI;          // 用于智能压缩的LLM实例
}
```

**主要功能：**
- `getTokenUsage(messages)`: 获取消息的token使用情况
- `getTotalTokens(messages)`: 获取消息的总token数
- `shouldCompress(messages)`: 判断是否需要压缩
- `compressMessages(messages)`: 压缩消息历史
- `manageContext(messages)`: 自动管理上下文（包含压缩逻辑）

**压缩策略：**
1. 保留系统消息（system message）
2. 保留最近10条消息（保持对话连贯性）
3. 压缩中间的历史消息
4. 如果提供了chatModel，使用LLM进行智能压缩
5. 否则使用简单压缩（截取前100字符）

**使用示例：**
```typescript
import { ContextManager } from './src/context/ContextManager.js';

const contextManager = new ContextManager({
  maxTokens: 100000,
  compressionThreshold: 0.8,
  modelName: 'gpt-4',
  chatModel: yourChatModel,
});

const result = await contextManager.manageContext(messages);

if (result.compressed) {
  console.log(`Compressed ${result.compressionResult.originalCount} messages to ${result.compressionResult.compressedCount}`);
  console.log(`Saved ${result.compressionResult.tokensSaved} tokens`);
}

contextManager.cleanup();
```

## 集成到CodingAgent

ContextManager已经集成到CodingAgent中，在每次执行前自动管理上下文：

```typescript
// src/agents/coding-agent.ts
async *execute(context: SessionContext): AsyncGenerator<any, void, unknown> {
  // 自动管理上下文
  const managedContext = await this.contextManager.manageContext(
    context.messages
  );

  // 更新token统计
  context.tokenUsage = managedContext.usage;

  // 记录压缩信息
  if (managedContext.compressed && managedContext.compressionResult) {
    context.compressionCount = (context.compressionCount || 0) + 1;
    console.log(`[Context Compression] ...`);
  }

  // 使用压缩后的消息执行
  const stream = await agent.stream(
    { messages: managedContext.messages },
    { recursionLimit: 100 }
  );
  
  // ...
}
```

## SessionContext扩展

SessionContext新增了两个字段用于跟踪token使用：

```typescript
export interface SessionContext {
  sessionId: string;
  messages: BaseMessage[];
  userName: string | null;
  todos: TodoItem[];
  createdAt: number;
  updatedAt: number;
  tokenUsage?: TokenUsage;      // token使用统计
  compressionCount?: number;    // 压缩次数
}
```

## 配置

可以在 `config.yaml` 中配置token管理参数：

```yaml
models:
  chat_model:
    model: gpt-4
    max_tokens: 100000           # 最大token数
    compression_threshold: 0.8   # 压缩阈值
    api_key: $OPENAI_API_KEY
    api_base: https://api.openai.com/v1
```

## 测试

运行测试脚本验证功能：

```bash
npx tsx test-token-management.ts
```

测试结果示例：
```
=== Testing Token Management ===

1. Testing TokenCounter:
   Text: "Hello, this is a test message for token counting."
   Tokens: 11

2. Testing message token counting:
   Total messages: 5
   Total tokens: 68

3. Testing token usage breakdown:
   Input tokens: 34
   Output tokens: 31
   Total tokens: 65

4. Testing ContextManager:
   Created 101 messages for testing
   Total tokens: 3715
   Should compress: true

5. Testing context management with compression:
   Compressed: true
   Original message count: 101
   Managed message count: 12
   Token usage: { inputTokens: 2532, outputTokens: 250, totalTokens: 2782 }
   Compression result: {
     compressed: true,
     originalCount: 101,
     compressedCount: 12,
     tokensSaved: 930
   }

=== Test completed successfully! ===
```

## 工作原理

### Token统计

使用 `js-tiktoken` 库进行token统计，支持多种模型的tokenizer：
- GPT-4
- GPT-3.5
- 其他OpenAI兼容模型

### 压缩触发条件

当消息总token数超过 `maxTokens * compressionThreshold` 时触发压缩。

例如：
- maxTokens = 100000
- compressionThreshold = 0.8
- 触发阈值 = 80000 tokens

### 压缩过程

1. **保留系统消息**：系统提示词不会被压缩
2. **保留最近消息**：最近10条消息保持原样（保证对话连贯）
3. **压缩中间消息**：
   - 如果有chatModel：使用LLM生成摘要
   - 否则：使用简单截取策略

4. **生成新的消息列表**：
   ```
   [系统消息] + [压缩的历史摘要] + [最近10条消息]
   ```

## 优势

1. **自动化**：无需手动管理token，自动触发压缩
2. **智能压缩**：使用LLM进行智能摘要，保留关键信息
3. **可配置**：支持自定义阈值和压缩策略
4. **透明度**：记录压缩次数和节省的token数
5. **兼容性**：与现有的LangChain消息系统完全兼容

## 注意事项

1. **压缩不可逆**：压缩后的消息无法恢复原始内容
2. **信息损失**：压缩会导致部分细节信息丢失
3. **性能开销**：智能压缩需要额外的LLM调用
4. **阈值设置**：建议根据实际使用情况调整压缩阈值

## 未来改进

- [ ] 支持更多压缩策略（如基于重要性的选择性保留）
- [ ] 支持压缩历史的持久化存储
- [ ] 添加压缩质量评估指标
- [ ] 支持自定义压缩提示词
- [ ] 优化压缩性能（批量处理、缓存等）
