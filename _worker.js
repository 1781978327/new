export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    console.log('Handling request for:', url.pathname);
    
    try {
      // 处理根路径和 index.html
      if (url.pathname === '/' || url.pathname === '/index.html') {
        console.log('Serving index.html');
        const response = await env.ASSETS.fetch(new Request(new URL('/index.html', request.url)));
        if (!response.ok) {
          throw new Error(`Failed to fetch index.html: ${response.status}`);
        }
        return new Response(response.body, {
          status: 200,
          headers: {
            'content-type': 'text/html;charset=UTF-8',
            'cache-control': 'no-cache',
            'access-control-allow-origin': '*'
          }
        });
      }

      // 处理静态资源
      console.log('Serving static asset:', url.pathname);
      let response = await env.ASSETS.fetch(request);
      
      // 如果资源没找到，尝试不同的路径
      if (!response.ok) {
        console.log('Asset not found, trying alternative path:', url.pathname);
        // 尝试从 assets 目录获取
        const assetsRequest = new Request(new URL('/assets' + url.pathname, request.url));
        response = await env.ASSETS.fetch(assetsRequest);
        
        // 如果还是没找到，尝试从根目录获取
        if (!response.ok) {
          console.log('Asset not found in assets directory, trying root path');
          const rootRequest = new Request(new URL(url.pathname.replace('/assets/', '/'), request.url));
          response = await env.ASSETS.fetch(rootRequest);
        }
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch asset ${url.pathname}: ${response.status}`);
      }

      // 设置正确的 MIME 类型
      const contentType = getContentType(url.pathname);
      return new Response(response.body, {
        status: 200,
        headers: {
          'content-type': contentType,
          'access-control-allow-origin': '*',
          'cache-control': 'public, max-age=31536000'
        }
      });
    } catch (e) {
      console.error('Error handling request:', e);
      return new Response(`Error: ${e.message}`, {
        status: 404,
        headers: {
          'content-type': 'text/plain;charset=UTF-8',
          'access-control-allow-origin': '*'
        }
      });
    }
  }
};

// 根据文件扩展名获取 MIME 类型
function getContentType(pathname) {
  const ext = pathname.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'gltf': 'model/gltf+json',
    'glb': 'model/gltf-binary',
    'obj': 'text/plain',
    'mtl': 'text/plain',
    'fbx': 'application/octet-stream',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav'
  };
  return types[ext] || 'application/octet-stream';
} 