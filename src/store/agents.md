# Store 模块

## 概述

`store` 模块使用 Zustand 实现应用的全局状态管理。管理 UI 状态、会话数据、消息流、TODO 列表等。

## 文件结构

```
store/
├── app-store.ts    # Zustand store 实现
├── selectors.ts    # 状态选择器
├── types.ts        # 类型定义
└── index.ts        # 模块导出
```

## 核心组件

### AppStore (app-store.ts)

使用 Zustand 创建的全局状态存储。

**状态结构：**

```typescript
interface Store {
  // 应用状态
  app: AppState;
  
  // 会话状态
  session: SessionState;
  
  // UI 状态
  ui: UIState;
  
  // 文件相关
  openFiles: Array<{ path: string; content: string }>;
  activeFilePath: string | null;
  
  // 终端相关
  terminalOutput: string[];
  isGenerating: boolean;
  
  // Actions...
}
```

**AppState - 应用状态：**

```typescript
interface AppState {
  currentFocus: FocusId;      // 当前焦点位置
  activeModal: ActiveModal;   // 当前打开的模态框
  isProcessing: boolean;      // 是否正在处理
  currentTheme: string;       // 当前主题
}
```

**SessionState - 会话状态：**

```typescript
interface SessionState {
  sessionId: string;
  messages: BaseMessage[];           // LangChain 消息
  displayMessages: Message[];        // UI 显示的消息
  todos: Todo[];                     // TODO 列表
  thinkingSteps: ThinkingStep[];     // 思考步骤
  currentStreamingBuffer: string;    // 流式输出缓冲
  currentStreamingMessageId: string | null;
}
```

**UIState - UI 状态：**

```typescript
interface UIState {
  terminalWidth: number;
  terminalHeight: number;
  showTodoPanel: boolean;
  historyExpanded: boolean;
}
```

**Actions（状态操作）：**

- 焦点管理: `setFocus`, `setActiveModal`, `closeModal`
- 处理状态: `setIsProcessing`, `setTheme`
- 消息管理: `addUserMessage`, `addAssistantMessage`, `addToolMessage`, `clearMessages`
- 流式处理: `updateStreamingBuffer`, `startStreaming`, `endStreaming`
- TODO 管理: `setTodos`, `addTodo`, `updateTodo`, `removeTodo`
- 思考步骤: `addThinkingStep`, `clearThinkingSteps`
- UI 控制: `setTerminalSize`, `toggleTodoPanel`, `toggleHistoryExpanded`
- 文件管理: `openFile`, `setActiveFile`
- 终端输出: `addTerminalOutput`, `clearTerminalOutput`

### Types (types.ts)

**Message - UI 显示消息：**

```typescript
interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
  toolResult?: string;
}
```

**ThinkingStep - 思考步骤：**

```typescript
interface ThinkingStep {
  type: 'tool_call' | 'tool_result' | 'reasoning';
  timestamp: number;
  content: string;
  toolName?: string;
  args?: unknown;
  result?: string;
}
```

**Todo - TODO 项：**

```typescript
interface Todo {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
}
```

## 依赖关系

```
store
├── zustand              # 状态管理库
└── @langchain/core      # 消息类型
```

## 使用方式

```typescript
import { useAppStore, useUI, useStoreActions } from './store';

// 在组件中使用
function MyComponent() {
  // 获取整个 store
  const store = useAppStore();
  
  // 使用选择器获取部分状态
  const ui = useUI();
  
  // 获取 actions
  const { addUserMessage, setIsProcessing } = useStoreActions();
  
  // 使用
  addUserMessage('Hello');
  setIsProcessing(true);
}

// 在组件外使用
const state = useAppStore.getState();
state.addUserMessage('Hello');
```

## 设计要点

1. **Zustand** - 轻量级状态管理，无 Provider 包装
2. **分层状态** - app、session、ui 清晰分离
3. **双重消息存储** - LangChain 消息 + UI 显示消息
4. **流式支持** - 专门的流式缓冲状态
5. **选择器** - 提供便捷的状态选择函数
