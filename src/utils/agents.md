# Utils 模块

## 概述

`utils` 模块包含项目中通用的工具函数和辅助类。

## 文件结构

```
utils/
└── startup-logger.ts  # 启动日志记录器
```

## 核心组件

### StartupLogger (startup-logger.ts)

启动阶段的日志记录器，用于收集和展示应用启动过程中的消息。

**消息类型：**

```typescript
interface StartupMessage {
  type: 'info' | 'error' | 'warning';
  message: string;
  timestamp: number;
}
```

**核心方法：**

- `log(message, type)` - 记录一条日志
- `getMessages()` - 获取所有日志消息
- `clear()` - 清空日志
- `subscribe(listener)` - 订阅日志更新

**使用场景：**

- MCP 服务器连接状态
- 会话创建/恢复通知
- 配置加载错误
- 初始化警告

**订阅模式：**

```typescript
const unsubscribe = startupLogger.subscribe((messages) => {
  // 更新 UI 显示
  setMessages(messages);
});

// 取消订阅
unsubscribe();
```

## 依赖关系

```
utils
└── (纯 TypeScript，无外部依赖)
```

## 使用方式

```typescript
import { startupLogger } from './utils/startup-logger';

// 记录信息
startupLogger.log('[MCP] Connected to server', 'info');

// 记录错误
startupLogger.log('Failed to load config', 'error');

// 记录警告
startupLogger.log('Using default settings', 'warning');

// 在组件中订阅
useEffect(() => {
  const unsubscribe = startupLogger.subscribe((messages) => {
    setStartupMessages(messages);
  });
  return () => unsubscribe();
}, []);
```

## 设计要点

1. **单例模式** - 全局唯一的日志实例
2. **发布-订阅** - UI 组件可订阅日志更新
3. **类型区分** - info/error/warning 三种级别
4. **时间戳** - 记录每条消息的时间
