# UI 模块

## 概述

`ui` 模块使用 React 和 Ink 构建终端用户界面。Ink 是一个 React 渲染器，可以在终端中渲染声明式 UI 组件。

## 文件结构

```
ui/
├── App.tsx                   # 主应用组件
├── components/
│   ├── ChatView.tsx          # 聊天视图
│   ├── EditorView.tsx        # 编辑器视图
│   ├── InputArea.tsx         # 输入区域
│   ├── MessageArea.tsx       # 消息展示区域
│   ├── MessageRenderer.tsx   # 单条消息渲染
│   ├── StatusBar.tsx         # 状态栏
│   ├── TerminalView.tsx      # 终端视图
│   ├── ThinkingBlock.tsx     # 思考过程展示
│   ├── TodoPanel.tsx         # TODO 面板
│   ├── TodoView.tsx          # TODO 视图
│   └── index.ts
└── themes/
    ├── ThemeManager.ts       # 主题管理器
    ├── presets.ts            # 预设主题
    ├── types.ts              # 主题类型定义
    └── index.ts
```

## 核心组件

### App (App.tsx)

主应用组件，整合所有子组件和状态管理。

**职责：**

1. 初始化 SessionManager 和 CodingAgent
2. 管理会话上下文
3. 处理用户输入，调用 Agent 执行
4. 处理流式响应，更新 UI 状态

**布局结构：**

```
┌─────────────────────────────────────┐
│ 🦌 DeerCode - AI Coding Assistant   │  <- 标题栏
├─────────────────────────────────────┤
│                                     │
│  MessageArea (消息展示)              │
│  - displayMessages                  │
│  - ThinkingBlock                    │
│                                     │
├─────────────────────────────────────┤
│  TodoPanel (可选)                   │
├─────────────────────────────────────┤
│ > _                                 │  <- InputArea
└─────────────────────────────────────┘
```

### MessageArea (components/MessageArea.tsx)

展示对话历史和当前处理状态。

**功能：**
- 渲染 displayMessages 列表
- 显示 ThinkingBlock（处理中）
- 显示等待状态指示器

### InputArea (components/InputArea.tsx)

用户输入组件。

**功能：**
- 文本输入框
- Enter 提交
- 处理中禁用输入

### MessageRenderer (components/MessageRenderer.tsx)

单条消息的渲染组件，根据消息类型选择不同样式。

### ThinkingBlock (components/ThinkingBlock.tsx)

展示 Agent 的思考过程，包括工具调用和推理步骤。

### TodoPanel (components/TodoPanel.tsx)

可折叠的 TODO 列表面板。

## 主题系统

### ThemeManager (themes/ThemeManager.ts)

主题管理单例，管理主题切换和注册。

**方法：**
- `getTheme()` - 获取当前主题
- `setTheme(name)` - 切换主题
- `listThemes()` - 列出所有主题
- `registerTheme(theme)` - 注册自定义主题

### 主题结构

```typescript
interface Theme {
  name: string;
  colors: {
    primary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    text: {
      normal: string;
      muted: string;
      inverse: string;
    };
    border: {
      normal: string;
      light: string;
    };
    background: {
      normal: string;
      highlight: string;
    };
  };
}
```

### 预设主题

- `ayu-dark` - 默认深色主题
- 其他预设...

## 依赖关系

```
ui
├── ink              # React 终端渲染器
├── ink-text-input   # 文本输入组件
├── react            # React 核心
├── store            # 状态管理
├── agents           # CodingAgent
└── session          # SessionManager
```

## 使用方式

```typescript
import React from 'react';
import { render } from 'ink';
import { App } from './ui/App';

// 启动应用
render(React.createElement(App));
```

## 设计要点

1. **Ink 框架** - 使用 React 声明式语法构建终端 UI
2. **组件化** - UI 拆分为独立的可复用组件
3. **主题支持** - 可切换的颜色主题系统
4. **流式展示** - 支持 AI 响应的流式渲染
5. **状态驱动** - 通过 Zustand store 驱动 UI 更新
