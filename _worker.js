export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    console.log('请求URL:', url.pathname);
    console.log('完整URL:', url.toString());

    // 添加CORS头
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
      'Access-Control-Allow-Headers': '*',
    };

    // 处理OPTIONS请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {
      // 处理静态文件请求
      console.log('尝试获取资源:', url.pathname);
      const response = await env.ASSETS.fetch(request);
      
      if (!response) {
        console.log('资源未找到:', url.pathname);
        return new Response('Not Found', { 
          status: 404,
          headers: corsHeaders
        });
      }

      // 设置正确的Content-Type
      const contentType = getContentType(url.pathname);
      console.log('资源类型:', contentType);
      
      const headers = new Headers(response.headers);
      headers.set('Content-Type', contentType);
      headers.set('Cache-Control', 'public, max-age=31536000');
      
      // 添加CORS头
      Object.entries(corsHeaders).forEach(([key, value]) => {
        headers.set(key, value);
      });

      // 检查响应状态
      if (!response.ok) {
        console.error('资源请求失败:', response.status, response.statusText);
        return new Response('Resource Error', {
          status: response.status,
          headers: corsHeaders
        });
      }

      console.log('返回资源:', url.pathname);
      return new Response(response.body, {
        status: response.status,
        headers
      });
    } catch (error) {
      console.error('错误:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders
      });
    }
  }
};

// 根据文件扩展名获取Content-Type
function getContentType(pathname) {
  const ext = pathname.split('.').pop().toLowerCase();
  const types = {
    'html': 'text/html',
    'js': 'application/javascript',
    'css': 'text/css',
    'json': 'application/json',
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'svg': 'image/svg+xml',
    'ico': 'image/x-icon',
    'glb': 'model/gltf-binary',
    'gltf': 'model/gltf+json',
    'fbx': 'application/octet-stream',
    'obj': 'text/plain',
    'mp4': 'video/mp4',
    'webm': 'video/webm',
    'ogg': 'audio/ogg',
    'mp3': 'audio/mpeg',
    'wav': 'audio/wav'
  };
  return types[ext] || 'application/octet-stream';
} 