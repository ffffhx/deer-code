# 🦌 deer-code (TypeScript 版本)

一个简约而强大的 AI 编码代理，使用 Node.js 和 TypeScript 构建。具有由 Ink 驱动的精美 CLI 界面、使用 Zustand 进行状态管理，以及通过 LangChain 和 LangGraph 实现的 AI 功能。

**已从 Python 迁移到 Node.js + TypeScript**

## 🚀 快速开始

### 前置要求

- [Node.js](https://nodejs.org/) 18.0 或更高版本
- [npm](https://www.npmjs.com/) 或 [yarn](https://yarnpkg.com/)

### 安装

1. **克隆仓库：**
   ```bash
   git clone https://github.com/magiccube/deer-flow.git
   cd deer-flow
   ```

2. **安装依赖：**
   ```bash
   npm install
   ```

3. **构建项目：**
   ```bash
   npm run build
   ```

### 配置

1. **复制配置模板：**
   ```bash
   cp config.example.yaml config.yaml
   ```

2. **编辑 `config.yaml` 文件并填入你的配置：**

```yaml
models:
  chat_model:
    model: 'gpt-4o-2024-08-06'
    api_base: 'https://api.openai.com/v1'
    api_key: $OPENAI_API_KEY
    temperature: 0
    max_tokens: 8192
```

### 运行应用

**启动 deer-code：**
```bash
npm start "/path/to/your/project"
```

**开发模式：**
```bash
npm run dev "/path/to/your/project"
```

## 🌟 特性

- ✅ **TypeScript**：完全类型化的代码库，提供更好的开发体验
- ✅ **Ink UI**：使用 React 组件构建的精美终端界面
- ✅ **Zustand**：简单而强大的状态管理
- ✅ **LangChain.js**：AI 驱动的代码辅助
- ✅ **LangGraph**：Agent 编排和工作流管理
- ✅ **多轮对话**：在交互过程中保持上下文
- ✅ **任务规划**：内置的待办事项系统用于项目管理
- ✅ **代码生成**：AI 驱动的代码创建和编辑
- ✅ **代码搜索**：智能代码定位和搜索
- ✅ **Bash 执行**：直接执行 bash 命令
- ✅ **文件操作**：查看、创建和编辑文件

## 📁 项目结构

```
deer-code/
├── src/
│   ├── agents/          # LangGraph agents
│   ├── cli/             # Ink UI 组件
│   ├── config/          # 配置管理
│   ├── context/         # Token 管理和压缩
│   ├── models/          # LLM 模型初始化
│   ├── session/         # 会话管理
│   ├── store/           # Zustand 状态管理
│   ├── tools/           # Agent 工具 (bash, editor, fs, todo)
│   ├── project.ts       # 项目管理
│   └── main.ts          # 入口文件
├── docs/
│   └── TOKEN_MANAGEMENT.md  # Token 管理文档
├── package.json
├── tsconfig.json
└── config.yaml
```

## 🛠️ 可用工具

- **bash**：在持久化 shell 中执行 bash 命令
- **tree**：显示目录结构
- **ls**：列出文件和目录
- **grep**：在文件中搜索模式（由 ripgrep 驱动）
- **text_editor**：查看、创建和编辑文件
- **todo_write**：管理待办事项

## 🧠 Token 管理与上下文压缩

deer-code 包含智能 token 管理，可高效处理长对话：

### 特性

- **自动 Token 计数**：使用 `js-tiktoken` 跟踪所有消息的 token 使用情况
- **智能压缩**：在接近 token 限制时自动压缩对话历史
- **可配置阈值**：设置自定义限制和压缩触发器
- **智能摘要**：使用 LLM 创建压缩历史的有意义摘要
- **上下文保留**：保持系统消息和最近对话的完整性

### 工作原理

1. **Token 跟踪**：计数并跟踪每条消息
2. **阈值检测**：当 token 达到限制的 80%（可配置）时触发压缩
3. **智能压缩**： 
   - 保留系统消息
   - 保留最后 10 条消息作为上下文
   - 将中间消息压缩为摘要
4. **无缝集成**：在后台自动进行

### 配置

```yaml
models:
  chat_model:
    max_tokens: 100000              # 最大 token 限制
    compression_threshold: 0.8      # 在 80% max_tokens 时压缩
```

### 示例输出

```
[Context Compression] Compressed 101 messages to 12, saved 930 tokens
```

详细文档请参见 [docs/TOKEN_MANAGEMENT.md](docs/TOKEN_MANAGEMENT.md)

## 🎨 UI 组件

使用 Ink（CLI 的 React）构建：

- **ChatView**：与 AI 助手的交互式聊天界面
- **EditorView**：支持标签页的文件查看器
- **TerminalView**：显示终端输出
- **TodoView**：任务管理界面

## 🔧 开发

**类型检查：**
```bash
npm run typecheck
```

**代码检查：**
```bash
npm run lint
```

**构建：**
```bash
npm run build
```

## 📝 脚本

- `npm run dev` - 使用 tsx 在开发模式下运行
- `npm run build` - 将 TypeScript 构建为 JavaScript
- `npm start` - 运行构建后的应用
- `npm run typecheck` - 类型检查（不生成文件）
- `npm run lint` - 检查代码规范

## 🤝 贡献

我们欢迎贡献！详情请参见我们的[贡献指南](CONTRIBUTING.md)。

## 📄 许可证

本项目是开源的，采用 [MIT 许可证](./LICENSE)。

## 🙏 致谢

- 原始 Python 版本由 [Henry Li](https://github.com/magiccube) 开发
- 受 [Anthropic's Claude Code](https://github.com/anthropics/claude-code) 启发
- 使用 [Ink](https://github.com/vadimdemedes/ink) 构建 CLI 界面
- 由 [LangChain.js](https://github.com/langchain-ai/langchainjs) 和 [LangGraph](https://github.com/langchain-ai/langgraphjs) 驱动
- 使用 [Zustand](https://github.com/pmndrs/zustand) 进行状态管理

## 🔄 迁移说明

这是原始 Python 版本的 TypeScript/Node.js 移植版本。主要变化：

- **Python → TypeScript**：完全的类型安全和现代 JavaScript 特性
- **Textual → Ink**：基于 React 的终端 UI 框架
- **Python state → Zustand**：轻量级状态管理
- **pexpect → node-pty**：Node.js 的终端模拟
- **LangChain Python → LangChain.js**：JavaScript/TypeScript LangChain 实现

核心功能和 agent 能力保持不变，通过 TypeScript 和现代工具链改善了开发体验。
