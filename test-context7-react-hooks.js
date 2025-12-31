// 测试通过Context7 MCP查询React Hooks官方文档

async function testContext7ReactHooks() {
  try {
    console.log('Testing context7 MCP connection for React Hooks documentation...');
    
    // Context7 MCP服务URL
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
          name: 'deer-code-react-hooks-query',
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
    console.log('Initialization successful');
    
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
    
    if (toolsResult.result && toolsResult.result.tools) {
      const tools = toolsResult.result.tools;
      console.log(`\nFound ${tools.length} tools:`);
      
      // 显示所有工具
      tools.forEach((tool, index) => {
        console.log(`${index + 1}. ${tool.name}: ${tool.description || 'No description'}`);
      });
      
      // 查找网页浏览或搜索相关工具
      const searchTools = tools.filter(tool => 
        tool.name.toLowerCase().includes('browse') || 
        tool.name.toLowerCase().includes('web') ||
        tool.name.toLowerCase().includes('url') ||
        tool.name.toLowerCase().includes('search') ||
        tool.name.toLowerCase().includes('query')
      );
      
      if (searchTools.length > 0) {
        console.log('\nFound search/browser tools:');
        searchTools.forEach(tool => {
          console.log(`- ${tool.name}: ${tool.description}`);
        });
        
        // 尝试使用第一个搜索工具查询React Hooks文档
        const searchTool = searchTools[0];
        console.log(`\nTrying to search for React Hooks documentation using ${searchTool.name}...`);
        
        // 根据工具类型准备不同的参数
        let searchParams = {};
        
        if (searchTool.name.toLowerCase().includes('browse') || searchTool.name.toLowerCase().includes('url')) {
          // 如果是浏览工具，直接访问React Hooks文档页面
          searchParams = {
            url: 'https://zh-hans.react.dev/reference/react'
          };
        } else if (searchTool.name.toLowerCase().includes('search')) {
          // 如果是搜索工具，搜索React Hooks相关内容
          searchParams = {
            query: 'React Hooks documentation official guide useState useEffect useContext useReducer',
            limit: 5
          };
        } else {
          // 默认参数
          searchParams = {
            query: 'React Hooks'
          };
        }
        
        const searchRequest = {
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: searchTool.name,
            arguments: searchParams
          },
        };
        
        const searchResponse = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(searchRequest),
        });
        
        if (!searchResponse.ok) {
          console.error(`HTTP error: ${searchResponse.status}`);
          return;
        }
        
        const searchResult = await searchResponse.json();
        
        if (searchResult.result) {
          console.log('\n=== React Hooks Documentation Search Results ===');
          console.log('Tool used:', searchTool.name);
          
          // 尝试解析结果
          if (searchResult.result.content) {
            // 如果有content字段，直接显示
            console.log('\nContent:', searchResult.result.content.substring(0, 1000) + '...');
          } else if (searchResult.result.text) {
            // 如果有text字段
            console.log('\nText:', searchResult.result.text.substring(0, 1000) + '...');
          } else if (searchResult.result.results) {
            // 如果是搜索结果
            console.log('\nSearch results:');
            searchResult.result.results.forEach((result, i) => {
              console.log(`\n${i + 1}. ${result.title || 'No title'}`);
              console.log(`   URL: ${result.url || 'No URL'}`);
              console.log(`   Snippet: ${result.snippet ? result.snippet.substring(0, 200) + '...' : 'No snippet'}`);
            });
          } else {
            // 显示完整结果
            console.log('\nFull result:', JSON.stringify(searchResult.result, null, 2));
          }
        } else if (searchResult.error) {
          console.error('Error from tool:', searchResult.error.message);
        }
      } else {
        console.log('\nNo search/browser tools found. Available tools:');
        tools.forEach(tool => {
          console.log(`- ${tool.name}: ${tool.description || 'No description'}`);
        });
        
        // 尝试使用其他可能相关的工具
        console.log('\nTrying to find documentation tools...');
        const docTools = tools.filter(tool => 
          tool.description && (
            tool.description.toLowerCase().includes('doc') ||
            tool.description.toLowerCase().includes('document') ||
            tool.description.toLowerCase().includes('api') ||
            tool.description.toLowerCase().includes('reference')
          )
        );
        
        if (docTools.length > 0) {
          console.log('Found documentation-related tools:');
          docTools.forEach(tool => {
            console.log(`- ${tool.name}: ${tool.description}`);
          });
        }
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

// 检查是否在浏览器环境
if (typeof window !== 'undefined' && window.fetch) {
  // 浏览器环境
  testContext7ReactHooks();
} else {
  // Node.js环境 - 使用内置fetch（Node 18+）
  if (typeof fetch === 'undefined') {
    console.error('Node.js version does not have built-in fetch. Please use Node.js 18+');
    process.exit(1);
  }
  testContext7ReactHooks();
}