# Chrome DevTools MCP 配置指南

## 问题
当前MCP使用默认的用户数据目录：
```
/Users/bytedance/.cache/chrome-devtools-mcp/chrome-profile
```

该目录已被占用，导致无法启动新的浏览器实例。

## 解决方案：使用不同的用户数据目录

### 方法1：修改MCP配置
查找MCP配置文件（通常在以下位置之一）：
1. `~/.config/mcp/config.json`
2. `~/.mcp/config.json`
3. 项目中的MCP配置文件

在配置文件中添加或修改用户数据目录设置：

```json
{
  "chrome-devtools": {
    "userDataDir": "/tmp/chrome-mcp-profile"
  }
}
```

### 方法2：通过环境变量设置
```bash
export CHROME_USER_DATA_DIR=/tmp/chrome-mcp-profile
# 然后重启MCP服务
```

### 方法3：创建清理脚本
创建脚本清理现有进程并使用新目录：

```bash
#!/bin/bash
# cleanup_and_restart.sh

# 停止现有Chrome进程
pkill -f "chrome-devtools-mcp"
killall chrome 2>/dev/null

# 删除锁文件
rm -f /Users/bytedance/.cache/chrome-devtools-mcp/chrome-profile/SingletonLock
rm -f /Users/bytedance/.cache/chrome-devtools-mcp/chrome-profile/*.lock

# 创建新的用户数据目录
mkdir -p /tmp/chrome-mcp-profile

# 设置环境变量
export CHROME_USER_DATA_DIR=/tmp/chrome-mcp-profile

echo "清理完成，可以重新启动MCP服务"
```

### 方法4：临时解决方案
如果无法修改MCP配置，可以：

1. **等待现有进程结束**：Chrome进程可能会自动结束
2. **重启系统**：最彻底的解决方案
3. **使用其他MCP工具**：如果可用的话

## 验证步骤
1. 清理现有进程
2. 设置新的用户数据目录
3. 重启MCP服务
4. 测试是否能正常打开网页

## 注意事项
- 不同的用户数据目录意味着新的浏览器会话，没有之前的cookies和历史记录
- 确保新目录有写入权限
- 测试完成后可以删除临时目录