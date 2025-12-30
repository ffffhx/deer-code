# 🚀 DeerCode TypeScript 版本 - 快速开始

## 📋 前置要求

1. **Node.js 18+**
   ```bash
   node --version  # 应该 >= 18.0.0
   ```

2. **npm 或 yarn**
   ```bash
   npm --version
   ```

3. **ripgrep** (用于 grep 工具)
   ```bash
   # macOS
   brew install ripgrep
   
   # Ubuntu/Debian
   apt-get install ripgrep
   
   # 验证安装
   rg --version
   ```

## 🔧 安装步骤

### 1. 安装依赖

```bash
cd /Users/bytedance/Code/deer-code
npm install
```

### 2. 配置 API Key

复制配置模板：
```bash
cp config.example.yaml config.yaml
```

编辑 `config.yaml`，设置你的 OpenAI API Key：

```yaml
models:
  chat_model:
    model: 'gpt-4o-2024-08-06'
    api_base: 'https://api.openai.com/v1'
    api_key: $OPENAI_API_KEY  # 或直接填写 API key
    temperature: 0
    max_tokens: 8192
```

或者设置环境变量：
```bash
export OPENAI_API_KEY='your-api-key-here'
```

### 3. 构建项目

```bash
npm run build
```

## ▶️ 运行应用

### 开发模式（推荐）

```bash
npm run dev .
```

或指定项目路径：
```bash
npm run dev /path/to/your/project
```

### 生产模式

```bash
npm start .
```

## 🎮 使用说明

### 界面布局

```
┌─────────────────────────────────────────────────┐
│  🦌 DeerCode - AI Coding Assistant              │
│  Press 'q' to quit | Tab to switch panels       │
├──────────────┬──────────────────────────────────┤
│              │                                   │
│   Chat       │        Editor View                │
│   (40%)      │         (60% height)              │
│              │                                   │
│              ├───────────────────────────────────┤
│              │                                   │
│              │  Terminal / TODO (Tab to switch)  │
│              │         (40% height)              │
└──────────────┴───────────────────────────────────┘
```

### 快捷键

- **q**: 退出应用
- **Tab**: 在 Terminal 和 TODO 面板之间切换
- **Enter**: 在聊天输入框中发送消息

### 示例对话

```
You: 帮我查看当前目录的文件结构