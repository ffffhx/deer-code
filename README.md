# 🦌 deer-code (TypeScript Version)

A minimalist yet powerful AI coding agent built with Node.js and TypeScript. Features a beautiful CLI interface powered by Ink, state management with Zustand, and AI capabilities through LangChain and LangGraph.

**Migrated from Python to Node.js + TypeScript**

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18.0 or higher
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/magiccube/deer-flow.git
   cd deer-flow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

### Configuration

1. **Copy the configuration template:**
   ```bash
   cp config.example.yaml config.yaml
   ```

2. **Edit `config.yaml` with your settings:**

```yaml
models:
  chat_model:
    model: 'gpt-4o-2024-08-06'
    api_base: 'https://api.openai.com/v1'
    api_key: $OPENAI_API_KEY
    temperature: 0
    max_tokens: 8192
```

### Running the Application

**Start deer-code:**
```bash
npm start "/path/to/your/project"
```

**Development mode:**
```bash
npm run dev "/path/to/your/project"
```

## 🌟 Features

- ✅ **TypeScript**: Fully typed codebase for better developer experience
- ✅ **Ink UI**: Beautiful terminal interface with React components
- ✅ **Zustand**: Simple and powerful state management
- ✅ **LangChain.js**: AI-powered code assistance
- ✅ **LangGraph**: Agent orchestration and workflow management
- ✅ **Multi-turn Conversations**: Maintains context across interactions
- ✅ **Task Planning**: Built-in todo system for project management
- ✅ **Code Generation**: AI-powered code creation and editing
- ✅ **Code Search**: Intelligent code location and search
- ✅ **Bash Execution**: Execute bash commands directly
- ✅ **File Operations**: View, create, and edit files

## 📁 Project Structure

```
deer-code/
├── src/
│   ├── agents/          # LangGraph agents
│   ├── cli/             # Ink UI components
│   ├── config/          # Configuration management
│   ├── context/         # Token management and compression
│   ├── models/          # LLM model initialization
│   ├── session/         # Session management
│   ├── store/           # Zustand state management
│   ├── tools/           # Agent tools (bash, editor, fs, todo)
│   ├── project.ts       # Project management
│   └── main.ts          # Entry point
├── docs/
│   └── TOKEN_MANAGEMENT.md  # Token management documentation
├── package.json
├── tsconfig.json
└── config.yaml
```

## 🛠️ Available Tools

- **bash**: Execute bash commands in a persistent shell
- **tree**: Display directory structure
- **ls**: List files and directories
- **grep**: Search for patterns in files (powered by ripgrep)
- **text_editor**: View, create, and edit files
- **todo_write**: Manage TODO items

## 🧠 Token Management & Context Compression

deer-code includes intelligent token management to handle long conversations efficiently:

### Features

- **Automatic Token Counting**: Tracks token usage for all messages using `js-tiktoken`
- **Smart Compression**: Automatically compresses conversation history when approaching token limits
- **Configurable Thresholds**: Set custom limits and compression triggers
- **Intelligent Summarization**: Uses LLM to create meaningful summaries of compressed history
- **Context Preservation**: Keeps system messages and recent conversations intact

### How It Works

1. **Token Tracking**: Every message is counted and tracked
2. **Threshold Detection**: When tokens reach 80% (configurable) of the limit, compression triggers
3. **Smart Compression**: 
   - Preserves system messages
   - Keeps the last 10 messages for context
   - Compresses middle messages into a summary
4. **Seamless Integration**: Happens automatically in the background

### Configuration

```yaml
models:
  chat_model:
    max_tokens: 100000              # Maximum token limit
    compression_threshold: 0.8      # Compress at 80% of max_tokens
```

### Example Output

```
[Context Compression] Compressed 101 messages to 12, saved 930 tokens
```

For detailed documentation, see [docs/TOKEN_MANAGEMENT.md](docs/TOKEN_MANAGEMENT.md)

## 🎨 UI Components

Built with Ink (React for CLI):

- **ChatView**: Interactive chat interface with the AI assistant
- **EditorView**: File viewer with tab support
- **TerminalView**: Display terminal output
- **TodoView**: Task management interface

## 🔧 Development

**Type checking:**
```bash
npm run typecheck
```

**Linting:**
```bash
npm run lint
```

**Build:**
```bash
npm run build
```

## 📝 Scripts

- `npm run dev` - Run in development mode with tsx
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run the built application
- `npm run typecheck` - Type check without emitting
- `npm run lint` - Lint the codebase

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).

## 🙏 Acknowledgments

- Original Python version by [Henry Li](https://github.com/magiccube)
- Inspired by [Anthropic's Claude Code](https://github.com/anthropics/claude-code)
- Built with [Ink](https://github.com/vadimdemedes/ink) for the CLI interface
- Powered by [LangChain.js](https://github.com/langchain-ai/langchainjs) and [LangGraph](https://github.com/langchain-ai/langgraphjs)
- State management by [Zustand](https://github.com/pmndrs/zustand)

## 🔄 Migration Notes

This is a TypeScript/Node.js port of the original Python version. Key changes:

- **Python → TypeScript**: Full type safety and modern JavaScript features
- **Textual → Ink**: React-based terminal UI framework
- **Python state → Zustand**: Lightweight state management
- **pexpect → node-pty**: Terminal emulation for Node.js
- **LangChain Python → LangChain.js**: JavaScript/TypeScript LangChain implementation

The core functionality and agent capabilities remain the same, with improved developer experience through TypeScript and modern tooling.
