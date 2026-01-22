#!/bin/bash

echo "尝试停止Chrome DevTools MCP相关进程..."

# 查找并杀死Chrome进程
pids=$(ps aux | grep -E "chrome-devtools-mcp|chrome.*profile" | grep -v grep | awk '{print $2}')

if [ -n "$pids" ]; then
    echo "找到以下进程PID: $pids"
    for pid in $pids; do
        echo "杀死进程 $pid"
        kill -9 $pid 2>/dev/null
    done
    echo "进程已停止"
else
    echo "未找到相关进程"
fi

# 检查配置文件目录
profile_dir="/Users/bytedance/.cache/chrome-devtools-mcp/chrome-profile"
if [ -d "$profile_dir" ]; then
    echo "检查配置文件目录: $profile_dir"
    
    # 查找并删除锁文件
    find "$profile_dir" -name "*.lock" -type f -delete 2>/dev/null
    echo "已删除锁文件"
    
    # 检查是否有SingletonLock文件
    if [ -f "$profile_dir/SingletonLock" ]; then
        echo "删除SingletonLock文件"
        rm -f "$profile_dir/SingletonLock"
    fi
fi

echo "清理完成"