const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const WebSocket = require('ws')

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// 处理保存模型数据的请求
ipcMain.handle('save-model-data', async (event, data) => {
  try {
    // 保存到应用根目录下的 data 文件夹
    const dataDir = path.join(__dirname, 'data')
    // 确保 data 目录存在
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir)
    }
    const filePath = path.join(dataDir, 'model-data.json')
    fs.writeFileSync(filePath, data)
    return { success: true, filePath }
  } catch (error) {
    console.error('保存文件失败:', error)
    return { success: false, error: error.message }
  }
})

// 处理读取模型数据的请求
ipcMain.handle('load-model-data', async () => {
  try {
    const filePath = path.join(__dirname, 'data', 'model-data.json')
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8')
      return { success: true, data: JSON.parse(data) }
    } else {
      return { success: false, error: '文件不存在' }
    }
  } catch (error) {
    console.error('读取文件失败:', error)
    return { success: false, error: error.message }
  }
})

// WebSocket 连接
const ws = new WebSocket('wss://3d-game.你的域名.workers.dev');

ws.onopen = () => {
  console.log('WebSocket 连接已建立');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // 处理接收到的消息
  console.log('收到消息:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket 错误:', error);
};

ws.onclose = () => {
  console.log('WebSocket 连接已关闭');
};