# Chrome DevTools MCP 问题解决方案

## 当前问题
Chrome DevTools MCP 报告错误：
```
The browser is already running for /Users/bytedance/.cache/chrome-devtools-mcp/chrome-profile. Use --isolated to run multiple browser instances.
```

## 手动解决方案

### 方法1：手动停止Chrome进程
1. 打开终端
2. 执行以下命令：

```bash
# 查找Chrome DevTools MCP进程
ps aux | grep chrome-devtools-mcp

# 停止相关进程
pkill -f "chrome-devtools-mcp"

# 或者强制停止
killall chrome 2>/dev/null
```

### 方法2：删除锁文件
```bash
# 删除Chrome配置文件锁文件
rm -f /Users/bytedance/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock
rm -f /Users/bytedance/.cache/chrome-devtools-mcp/chrome-profile/*.lock
```

### 方法3：重启系统（最彻底）
重启电脑可以确保所有Chrome进程都被终止。

## 预防措施
1. 确保在使用MCP工具前没有其他Chrome实例运行
2. 考虑使用不同的用户数据目录
3. 或者配置MCP使用`--isolated`模式

## 替代方案
如果无法解决浏览器冲突，可以考虑：
1. 使用其他网页测试工具
2. 使用curl等命令行工具获取网页信息
3. 使用Python的requests库进行网页请求