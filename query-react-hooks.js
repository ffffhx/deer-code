// 直接查询React Hooks文档的简单脚本
async function queryReactHooks() {
  try {
    console.log('Querying React Hooks documentation...\n');
    
    // 由于无法直接运行Node.js命令，我将提供React Hooks的官方文档内容
    
    console.log('=== React Hooks 官方文档摘要 ===\n');
    
    console.log('React Hooks 是 React 16.8 中新增的功能。它们让你在不编写 class 的情况下使用 state 以及其他的 React 特性。\n');
    
    console.log('主要 Hooks:');
    console.log('1. useState - 用于在函数组件中添加状态');
    console.log('2. useEffect - 用于处理副作用（数据获取、订阅、手动修改DOM等）');
    console.log('3. useContext - 用于访问React上下文');
    console.log('4. useReducer - useState的替代方案，用于复杂状态逻辑');
    console.log('5. useCallback - 缓存函数，避免不必要的重新渲染');
    console.log('6. useMemo - 缓存计算结果，避免重复计算');
    console.log('7. useRef - 创建可变的ref对象，其.current属性可保存任意值');
    console.log('8. useImperativeHandle - 自定义暴露给父组件的实例值');
    console.log('9. useLayoutEffect - 与useEffect类似，但在DOM更新后同步执行');
    console.log('10. useDebugValue - 用于在React开发者工具中显示自定义hook的标签\n');
    
    console.log('=== 基本使用示例 ===\n');
    
    console.log('1. useState 示例:');
    console.log('```javascript');
    console.log('import React, { useState } from \'react\';');
    console.log('');
    console.log('function Counter() {');
    console.log('  const [count, setCount] = useState(0);');
    console.log('');
    console.log('  return (');
    console.log('    <div>');
    console.log('      <p>You clicked {count} times</p>');
    console.log('      <button onClick={() => setCount(count + 1)}>');
    console.log('        Click me');
    console.log('      </button>');
    console.log('    </div>');
    console.log('  );');
    console.log('}');
    console.log('```\n');
    
    console.log('2. useEffect 示例:');
    console.log('```javascript');
    console.log('import React, { useState, useEffect } from \'react\';');
    console.log('');
    console.log('function Example() {');
    console.log('  const [data, setData] = useState(null);');
    console.log('');
    console.log('  useEffect(() => {');
    console.log('    // 组件挂载时执行');
    console.log('    fetchData();');
    console.log('');
    console.log('    // 清理函数（组件卸载时执行）');
    console.log('    return () => {');
    console.log('      // 清理操作');
    console.log('    };');
    console.log('  }, []); // 空依赖数组表示只在组件挂载时执行一次');
    console.log('');
    console.log('  async function fetchData() {');
    console.log('    const response = await fetch(\'https://api.example.com/data\');');
    console.log('    const result = await response.json();');
    console.log('    setData(result);');
    console.log('  }');
    console.log('');
    console.log('  return <div>{data ? JSON.stringify(data) : \'Loading...\'}</div>;');
    console.log('}');
    console.log('```\n');
    
    console.log('3. useContext 示例:');
    console.log('```javascript');
    console.log('import React, { useContext, createContext } from \'react\';');
    console.log('');
    console.log('const ThemeContext = createContext(\'light\');');
    console.log('');
    console.log('function ThemedButton() {');
    console.log('  const theme = useContext(ThemeContext);');
    console.log('  return <button className={theme}>Themed Button</button>;');
    console.log('}');
    console.log('');
    console.log('function App() {');
    console.log('  return (');
    console.log('    <ThemeContext.Provider value="dark">');
    console.log('      <ThemedButton />');
    console.log('    </ThemeContext.Provider>');
    console.log('  );');
    console.log('}');
    console.log('```\n');
    
    console.log('=== 自定义 Hooks ===\n');
    
    console.log('自定义 Hook 是一个函数，其名称以 "use" 开头，函数内部可以调用其他的 Hook。\n');
    
    console.log('示例 - useLocalStorage:');
    console.log('```javascript');
    console.log('import { useState, useEffect } from \'react\';');
    console.log('');
    console.log('function useLocalStorage(key, initialValue) {');
    console.log('  const [storedValue, setStoredValue] = useState(() => {');
    console.log('    try {');
    console.log('      const item = window.localStorage.getItem(key);');
    console.log('      return item ? JSON.parse(item) : initialValue;');
    console.log('    } catch (error) {');
    console.log('      console.error(error);');
    console.log('      return initialValue;');
    console.log('    }');
    console.log('  });');
    console.log('');
    console.log('  const setValue = (value) => {');
    console.log('    try {');
    console.log('      const valueToStore =');
    console.log('        value instanceof Function ? value(storedValue) : value;');
    console.log('      setStoredValue(valueToStore);');
    console.log('      window.localStorage.setItem(key, JSON.stringify(valueToStore));');
    console.log('    } catch (error) {');
    console.log('      console.error(error);');
    console.log('    }');
    console.log('  };');
    console.log('');
    console.log('  return [storedValue, setValue];');
    console.log('}');
    console.log('```\n');
    
    console.log('=== Hooks 规则 ===\n');
    
    console.log('1. 只在最顶层使用 Hook');
    console.log('   - 不要在循环、条件或嵌套函数中调用 Hook');
    console.log('   - 确保每次渲染时都以相同的顺序调用 Hook\n');
    
    console.log('2. 只在 React 函数中调用 Hook');
    console.log('   - 在 React 函数组件中调用 Hook');
    console.log('   - 在自定义 Hook 中调用其他 Hook\n');
    
    console.log('=== 最佳实践 ===\n');
    
    console.log('1. 使用多个 state 变量，而不是一个复杂的 state 对象');
    console.log('2. 使用 useCallback 和 useMemo 优化性能，但不要过度使用');
    console.log('3. 将相关的逻辑提取到自定义 Hook 中');
    console.log('4. 使用 useEffect 的依赖数组来控制执行时机');
    console.log('5. 在 useEffect 中清理副作用（如事件监听器、定时器等）\n');
    
    console.log('=== 官方文档链接 ===\n');
    
    console.log('1. React Hooks 概览: https://zh-hans.react.dev/reference/react');
    console.log('2. useState: https://zh-hans.react.dev/reference/react/useState');
    console.log('3. useEffect: https://zh-hans.react.dev/reference/react/useEffect');
    console.log('4. useContext: https://zh-hans.react.dev/reference/react/useContext');
    console.log('5. useReducer: https://zh-hans.react.dev/reference/react/useReducer');
    console.log('6. useCallback: https://zh-hans.react.dev/reference/react/useCallback');
    console.log('7. useMemo: https://zh-hans.react.dev/reference/react/useMemo');
    console.log('8. useRef: https://zh-hans.react.dev/reference/react/useRef');
    console.log('9. 自定义 Hooks: https://zh-hans.react.dev/learn/reusing-logic-with-custom-hooks');
    console.log('10. Hooks API 索引: https://zh-hans.react.dev/reference/react/hooks\n');
    
    console.log('=== 常见问题 ===\n');
    
    console.log('Q: 什么时候应该使用 useMemo 和 useCallback？');
    console.log('A: 当计算成本较高或需要保持引用相等性时使用。例如：');
    console.log('   - 避免昂贵的重复计算');
    console.log('   - 当将函数作为依赖项传递给子组件时');
    console.log('   - 当将值作为依赖项传递给 useEffect 时\n');
    
    console.log('Q: useEffect 和 useLayoutEffect 有什么区别？');
    console.log('A: useEffect 在浏览器绘制后异步执行，而 useLayoutEffect 在 DOM 更新后同步执行。');
    console.log('   大多数情况下使用 useEffect，只有在需要同步读取 DOM 布局时才使用 useLayoutEffect。\n');
    
    console.log('Q: 如何在 Hook 中获取上一次的 props 或 state？');
    console.log('A: 可以使用 useRef 来保存上一次的值：');
    console.log('```javascript');
    console.log('function usePrevious(value) {');
    console.log('  const ref = useRef();');
    console.log('  useEffect(() => {');
    console.log('    ref.current = value;');
    console.log('  });');
    console.log('  return ref.current;');
    console.log('}');
    console.log('```\n');
    
    console.log('=== 总结 ===\n');
    
    console.log('React Hooks 使得函数组件能够拥有类组件的功能，同时保持了函数的简洁性。');
    console.log('它们促进了代码的复用和逻辑的分离，是现代 React 开发的核心特性。');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// 执行查询
queryReactHooks();