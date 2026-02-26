# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Deer-code is an AI coding agent project that provides a minimalist yet sufficient framework for developing AI-powered coding assistants. It uses LangChain and LangGraph for agent orchestration and supports MCP (Model Context Protocol) for extensible tool integration.

## Development Commands

```bash
# Install dependencies (uses pnpm)
pnpm install

# Development mode - run the agent directly with tsx
pnpm dev

# Build the project
pnpm build

# Run type checking
pnpm typecheck

# Run linting
pnpm lint

# Start the built application
pnpm start
```

## Architecture Overview

### Core Components

1. **Agent System** (`src/agents/`)
   - `CodingAgent`: Main agent class that orchestrates AI interactions
   - Uses LangChain's ReactAgent pattern with LangGraph
   - Manages context compression and token limits

2. **Tool System** (`src/tools/`)
   - Built-in tools: bash, grep, ls, tree, text editor, todo management
   - Tools are LangChain-compatible and follow consistent patterns
   - Each tool has its own directory with implementation and tests

3. **MCP Integration** (`src/mcp/`)
   - Supports external MCP servers via stdio and HTTP transports
   - Automatically converts MCP tools to LangChain format
   - Tools are prefixed with `mcp_{server_name}_{tool_name}`

4. **Session Management** (`src/session/`)
   - Persistent session storage and management
   - Commands: start, list, switch, delete, info

5. **Context Management** (`src/context/`)
   - Token counting and context compression
   - Automatic summarization when approaching token limits

### Configuration

Configuration is managed through `config.yaml`:
- Model settings (API keys, base URLs, parameters)
- MCP server configurations
- Context management settings

### Key Patterns

- All imports use `.js` extension (ESM requirement)
- Tools follow a standard interface with `name`, `description`, and `schema`
- Error handling includes user-friendly messages
- Git hooks enforce commit message format and type checking

## Important Notes

- The project uses ES modules (`"type": "module"` in package.json)
- TypeScript compilation targets ES2022
- React is used for terminal UI components (Ink framework)
- All file operations should respect the project root directory from `project.rootDir`
- MCP servers are initialized at startup and disconnected on cleanup