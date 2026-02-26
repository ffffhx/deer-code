# Models 模块

## 概述

`models` 模块负责初始化和配置 AI 聊天模型。基于 LangChain 的 ChatOpenAI 类，支持 OpenAI 及其兼容 API（如 DeepSeek）。

## 文件结构

```
models/
├── chat-model.ts    # 模型初始化实现
└── index.ts         # 模块导出
```

## 核心功能

### initChatModel (chat-model.ts)

初始化 ChatOpenAI 模型实例。

**配置读取：**

从 `config.yaml` 的 `models.chat_model` 节读取配置。

**API Key 解析顺序：**

1. 配置文件直接指定 `api_key`
2. 配置文件引用环境变量 `api_key: "$ENV_VAR"`
3. 默认环境变量 `OPENAI_API_KEY` 或 `DEEPSEEK_API_KEY`

**支持的配置项：**

```yaml
models:
  chat_model:
    model: "gpt-4"                    # 模型名称（必需）
    api_key: "$OPENAI_API_KEY"        # API 密钥
    api_base: "https://api.openai.com/v1"  # API 基础 URL
    max_tokens: 100000                # 最大 Token 数
    temperature: 0.7                  # 温度参数
    # ... 其他 ChatOpenAI 支持的参数
```

**返回值：**

配置好的 `ChatOpenAI` 实例，可直接用于 Agent 或单独调用。

## 依赖关系

```
models
├── @langchain/openai  # ChatOpenAI 类
└── config             # 配置读取
```

## 使用方式

```typescript
import { initChatModel } from './models';

// 初始化模型
const model = initChatModel();

// 直接调用
const response = await model.invoke([
  new HumanMessage("Hello!")
]);

// 用于 Agent
const agent = createReactAgent({
  llm: model,
  tools: [...],
});
```

## 设计要点

1. **OpenAI 兼容** - 支持任何 OpenAI API 兼容的服务
2. **灵活的 Key 配置** - 支持直接配置、环境变量引用、默认环境变量
3. **自定义 Base URL** - 可指向自建服务或其他提供商
4. **配置透传** - 未知配置项直接传递给 ChatOpenAI
