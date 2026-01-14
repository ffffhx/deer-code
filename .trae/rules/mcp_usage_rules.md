# MCP 工具使用规则

## Context7 使用规则

当遇到以下情况时，**自动使用 Context7 MCP** 查询最新的官方文档和代码示例：

### 必须使用的场景：
1. **学习新库/框架**：用户询问如何使用某个特定的库、框架或工具（如 React、Next.js、MongoDB、Supabase 等）
2. **API 使用方法**：需要了解某个库的具体 API 用法、参数说明或最佳实践
3. **代码示例请求**：用户明确要求提供某个功能的实现示例
4. **版本特定功能**：询问某个特定版本的功能或变更
5. **集成指南**：需要了解如何集成第三方服务或库
6. **最佳实践**：询问某个技术栈的推荐做法或设计模式

### 使用流程：
1. 首先调用 `resolve-library-id` 获取正确的 library ID
2. 然后调用 `query-docs` 查询具体文档
3. 每个问题最多调用 3 次，避免过度查询

### 示例触发词：
- "如何使用 [库名]..."
- "[库名] 的文档"
- "最新的 [库名] API"
- "[库名] 示例代码"
- "怎么集成 [库名]"

---

## Chrome DevTools MCP 使用规则

当遇到以下情况时，**自动使用 Chrome DevTools MCP** 进行浏览器自动化和调试：

### 必须使用的场景：
1. **网页测试**：需要测试网页功能、交互或响应
2. **UI 调试**：检查页面元素、样式或布局问题
3. **性能分析**：分析页面加载性能、Core Web Vitals
4. **网络请求调试**：查看 API 调用、请求/响应数据
5. **表单自动化**：自动填写和提交表单
6. **页面截图**：需要捕获页面或元素的视觉状态
7. **控制台日志**：查看浏览器控制台的错误或日志
8. **自动化操作**：模拟用户点击、输入、导航等行为

### 常用工具：
- `list_pages` / `new_page` / `select_page`：页面管理
- `navigate_page`：导航到 URL
- `take_snapshot`：获取页面文本快照（优先于截图）
- `take_screenshot`：截图
- `click` / `fill` / `press_key`：交互操作
- `list_network_requests` / `get_network_request`：网络分析
- `list_console_messages` / `get_console_message`：控制台日志
- `performance_start_trace` / `performance_stop_trace`：性能分析

### 示例触发词：
- "测试这个网页"
- "检查 [URL] 的..."
- "截图 [URL]"
- "查看网络请求"
- "分析页面性能"
- "自动填写表单"
- "点击 [元素]"

---

## 组合使用场景

某些场景可能需要**同时使用两个 MCP**：

1. **学习并实践**：先用 Context7 查询文档，再用 Chrome DevTools 测试实现
2. **调试第三方集成**：用 Chrome DevTools 查看网络请求，用 Context7 查询 API 文档
3. **性能优化**：用 Chrome DevTools 分析问题，用 Context7 查询优化最佳实践

---

## 注意事项

1. **不要过度使用**：每个工具每个问题最多调用 3 次
2. **优先本地搜索**：如果是项目内代码问题，优先使用 SearchCodebase、Grep 等本地工具
3. **敏感信息**：不要在 Context7 查询中包含 API keys、密码等敏感信息
4. **Chrome DevTools 前提**：使用前确保有可用的浏览器实例
