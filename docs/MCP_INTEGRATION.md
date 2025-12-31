# MCP协议集成文档

## 概述

本项目已完成MCP（Model Context Protocol）协议的集成，允许通过配置文件添加外部MCP服务器，扩展AI Coding Agent的能力。

## 架构设计

MCP集成包含以下核心组件：

### 1. 类型定义 (`src/mcp/types.ts`)
- `MCPServerConfig`: MCP服务器配置接口
- `MCPTool`: MCP工具定义
- `MCPRequest/MCPResponse`: JSON-RPC 2.0协议消息格式
- `MCPInitializeResult`: 服务器初始化结果

### 2. MCP客户端 (`src/mcp/client.ts`)
实现了与MCP服务器通信的客户端，支持两种传输方式：
- **stdio传输**: 通过子进程的标准输入输出通信
- **HTTP传输**: 通过HTTP POST请求通信

核心功能：
- `connect()`: 连接到MCP服务器
- `listTools()`: 获取服务器提供的工具列表
- `callTool()`: 调用MCP工具
- `disconnect()`: 断开连接

### 3. 服务器管理器 (`src/mcp/manager.ts`)
管理多个MCP服务器实例：
- `addServer()`: 添加并连接新的MCP服务器
- `removeServer()`: 移除并断开MCP服务器
- `getAllTools()`: 获取所有服务器的工具列表
- `callTool()`: 调用指定服务器的工具
- `disconnectAll()`: 断开所有服务器连接

### 4. 工具转换器 (`src/mcp/tool-converter.ts`)
将MCP工具转换为LangChain工具格式：
- `jsonSchemaToZod()`: 将JSON Schema转换为Zod Schema
- `convertMCPToolToLangChain()`: 转换单个MCP工具
- `loadMCPTools()`: 加载所有MCP工具

## 配置方法

在 `config.yaml` 文件中添加MCP服务器配置：

### HTTP传输方式示例

```yaml
tools:
  mcp_servers:
    context7:
      transport: 'streamable_http'
      url: 'https://mcp.context7.com/mcp'
```

### stdio传输方式示例

```yaml
tools:
  mcp_servers:
    my_local_server:
      transport: 'stdio'
      command: 'node'
      args: ['path/to/your/mcp-server.js']
      env:
        API_KEY: $YOUR_API_KEY
```

## 使用流程

1. **启动时初始化**: 在 `start` 命令执行时，自动读取配置并初始化所有MCP服务器
2. **工具加载**: CodingAgent在执行时自动加载所有MCP工具
3. **工具调用**: Agent可以像使用内置工具一样调用MCP工具
4. **清理资源**: 在Agent清理时自动断开所有MCP服务器连接

## 工具命名规则

MCP工具在转换为LangChain工具时，会按以下规则命名：

```
mcp_{服务器名称}_{工具名称}
```

例如：
- 服务器名称: `context7`
- 工具名称: `query-docs`
- 最终工具名: `mcp_context7_query-docs`

## 错误处理

- 如果MCP服务器连接失败，会在控制台输出错误信息，但不会阻止应用启动
- 工具调用失败时，会返回错误信息给Agent，由Agent决定如何处理
- 所有MCP相关的日志都带有 `[MCP]` 前缀，便于识别

## 扩展开发

### 创建自定义MCP服务器

1. 实现MCP协议的JSON-RPC 2.0接口
2. 支持以下必需方法：
   - `initialize`: 初始化服务器
   - `initialized`: 确认初始化完成
   - `tools/list`: 返回工具列表
   - `tools/call`: 执行工具调用

3. 工具定义格式：
```typescript
{
  name: "tool_name",
  description: "工具描述",
  inputSchema: {
    type: "object",
    properties: {
      param1: { type: "string", description: "参数1描述" }
    },
    required: ["param1"]
  }
}
```

### 添加新的传输方式

在 `MCPClient` 类中添加新的连接方法，并在 `connect()` 方法中添加相应的分支逻辑。

## 参考资料

- [MCP协议规范](https://modelcontextprotocol.io/)
- [Blade项目文档](https://bytedance.larkoffice.com/wiki/NR58wnK1qiXa3ZklGfPc6eaenqh)
- [LangChain工具文档](https://js.langchain.com/docs/modules/agents/tools/)
