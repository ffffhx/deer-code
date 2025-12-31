// 测试context7 MCP连接
async function testContext7() {
  try {
    console.log('Testing context7 MCP connection...');
    
    // 尝试直接使用fetch访问context7 MCP服务
    const url = 'https://mcp.context7.com/mcp';
    
    console.log(`Connecting to ${url}...`);
    
    // 发送初始化请求
    const initRequest = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {
          roots: {
            listChanged: true,
          },
          sampling: {},
        },
        clientInfo: {
          name: 'deer-code-test',
          version: '0.1.0',
        },
      },
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(initRequest),
    });
    
    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      const text = await response.text();
      console.error(`Response: ${text}`);
      return;
    }
    
    const initResult = await response.json();
    console.log('Initialization result:', JSON.stringify(initResult, null, 2));
    
    // 列出可用工具
    const toolsRequest = {
      jsonrpc: '2.0',
      id: 2,
      method: 'tools/list',
      params: {},
    };
    
    const toolsResponse = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toolsRequest),
    });
    
    if (!toolsResponse.ok) {
      console.error(`HTTP error: ${toolsResponse.status}`);
      return;
    }
    
    const toolsResult = await toolsResponse.json();
    console.log('\nAvailable tools:', JSON.stringify(toolsResult, null, 2));
    
    // 检查是否有网页浏览工具
    if (toolsResult.result && toolsResult.result.tools) {
      const tools = toolsResult.result.tools;
      console.log(`\nFound ${tools.length} tools:`);
      
      tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}: ${tool.description || 'No description'}`);
      });
      
      // 查找网页浏览相关工具
      const browserTools = tools.filter(tool => 
        tool.name.toLowerCase().includes('browse') || 
        tool.name.toLowerCase().includes('web') ||
        tool.name.toLowerCase().includes('url')
      );
      
      if (browserTools.length > 0) {
        console.log('\nFound browser/web tools:');
        browserTools.forEach(tool => {
          console.log(`- ${tool.name}: ${tool.description}`);
        });
        
        // 尝试使用浏览工具访问React官网
        const browseTool = browserTools[0];
        console.log(`\nTrying to browse https://zh-hans.react.dev/ using ${browseTool.name}...`);
        
        const browseRequest = {
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: browseTool.name,
            arguments: {
              url: 'https://zh-hans.react.dev/'
            }
          },
        };
        
        const browseResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(browseRequest),
        });
        
        if (!browseResponse.ok) {
          console.error(`HTTP error: ${browseResponse.status}`);
          return;
        }
        
        const browseResult = await browseResponse.json();
        console.log('\nBrowse result:', JSON.stringify(browseResult, null, 2));
      } else {
        console.log('\nNo browser/web tools found. Available tools:');
        tools.forEach(tool => {
          console.log(`- ${tool.name}: ${tool.description || 'No description'}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

testContext7();