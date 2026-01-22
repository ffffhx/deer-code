# Selectors 类型错误修复

## 问题
`src/store/selectors.ts` 文件在 IDE 中显示类型错误，提示"类型 xxx 上不存在属性 xxx"。

## 根本原因
Zustand 的 `useAppStore` selector 函数的参数类型推断不够明确。IDE 的 TypeScript 语言服务器将 `state` 参数推断为 `AppState` 而不是完整的 `Store` 类型。

## 解决方案

### 1. 导出 Store 类型 ✅
将 `Store` 接口从 `private` 改为 `export`：

```typescript
// src/store/app-store.ts
export interface Store {
  app: AppState;
  session: SessionState;
  ui: UIState;
  // ... 所有方法
}
```

### 2. 在 selectors 中明确类型注解 ✅
为所有 selector 函数添加明确的返回类型和参数类型：

```typescript
// src/store/selectors.ts
import { useAppStore, type Store } from './app-store.js';

// ✅ 明确返回类型和参数类型
export const useApp = (): AppState => useAppStore((state: Store) => state.app);
export const useSession = (): SessionState => useAppStore((state: Store) => state.session);
export const useUI = (): UIState => useAppStore((state: Store) => state.ui);

// ✅ 细粒度 selectors 也添加类型
export const useIsProcessing = (): boolean => useAppStore((state: Store) => state.app.isProcessing);
export const useTodos = (): Todo[] => useAppStore((state: Store) => state.session.todos);
```

### 3. 为 StoreActions 创建接口 ✅
创建明确的接口类型，提高类型安全性：

```typescript
export interface StoreActions {
  addUserMessage: (content: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  addThinkingStep: (step: ThinkingStep) => void;
  // ... 其他方法
}

export const useStoreActions = (): StoreActions => useAppStore((state: Store) => ({
  addUserMessage: state.addUserMessage,
  setIsProcessing: state.setIsProcessing,
  // ... 其他方法
}));
```

### 4. 更新导出 ✅
在 `src/store/index.ts` 中导出 `Store` 类型：

```typescript
export { useAppStore, type Store } from './app-store.js';
export * from './types.js';
export * from './selectors.js';
```

## 验证

### ✅ TypeScript 编译通过
```bash
npm run typecheck
# 输出：无错误
```

### ✅ 构建成功
```bash
npm run build
# 输出：构建成功
```

## 最终文件结构

```typescript
// src/store/selectors.ts
import { useAppStore, type Store } from './app-store.js';
import type { AppState, SessionState, UIState, Todo, ThinkingStep, ActiveModal } from './types.js';

// 状态 selectors - 明确返回类型
export const useApp = (): AppState => useAppStore((state: Store) => state.app);
export const useSession = (): SessionState => useAppStore((state: Store) => state.session);
export const useUI = (): UIState => useAppStore((state: Store) => state.ui);

// 细粒度 selectors
export const useIsProcessing = (): boolean => useAppStore((state: Store) => state.app.isProcessing);
export const useTodos = (): Todo[] => useAppStore((state: Store) => state.session.todos);
// ... 更多

// Actions interface
export interface StoreActions {
  addUserMessage: (content: string) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  // ... 更多
}

// Actions selector
export const useStoreActions = (): StoreActions => useAppStore((state: Store) => ({
  addUserMessage: state.addUserMessage,
  setIsProcessing: state.setIsProcessing,
  // ... 更多
}));
```

## 关键改进

1. **明确的类型注解**
   - 所有 selector 函数都有明确的返回类型
   - 所有 selector 回调参数都明确标注为 `Store` 类型

2. **导出 Store 类型**
   - 使 Store 类型在整个项目中可用
   - 提高类型推断的准确性

3. **StoreActions 接口**
   - 为 actions 创建专门的接口
   - 提高代码可维护性和类型安全性

## IDE 建议

如果 IDE 仍然显示错误（缓存问题），尝试：

1. **重启 TypeScript 服务器**
   - VS Code: `Cmd+Shift+P` → "TypeScript: Restart TS Server"
   - WebStorm: 右键项目 → "Reload from Disk"

2. **重新打开文件**
   - 关闭 `selectors.ts` 文件
   - 重新打开

3. **清理并重建**
   ```bash
   rm -rf dist
   npm run build
   ```

## 总结

通过添加明确的类型注解和导出 `Store` 类型，我们：
- ✅ 解决了所有 IDE 类型错误
- ✅ 提高了类型推断的准确性
- ✅ 改善了 IDE 的智能提示
- ✅ 增强了代码的可维护性
- ✅ 保持了向后兼容性

所有更改都通过了 TypeScript 编译器的严格检查！
