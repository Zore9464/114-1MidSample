//1、引入http模組
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

//2、創建http伺服器
const server = http.createServer(function (request, response) {
  const url = request.url;
  console.log('請求URL:', url);

  // 處理靜態檔案（CSS、JS、圖片等）
  const staticExtensions = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico'];
  const extname = path.extname(url);
  
  if (staticExtensions.includes(extname)) {
    const filePath = '.' + url;
    
    const contentTypes = {
      '.css': 'text/css',
      '.js': 'text/javascript',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.ico': 'image/x-icon'
    };

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log('靜態檔案讀取錯誤:', filePath, err);
        response.writeHead(404);
        response.end('檔案未找到');
      } else {
        response.writeHead(200, {
          'Content-Type': contentTypes[extname] || 'text/plain'
        });
        response.end(data);
      }
    });
    return;
  }

  let filePath = '';
  let cssFile = '';

  // 使用 switch 處理路由
  switch (url) {
    case '/':
      filePath = './index.ejs';
      cssFile = 'style.css';
      break;
    case '/calculator':
      filePath = './index2.ejs';
      cssFile = 'style2.css';
      break;
    default:
      
      break;
  }

  // 讀取並渲染 EJS 頁面
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.log('EJS 檔案讀取錯誤:', err);
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('伺服器讀取檔案錯誤');
    } else {
      try {
        const html = ejs.render(data, {
          cssFile: cssFile,
          currentUrl: url
        });
        response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        response.end(html);
      } catch (renderError) {
        console.log('EJS 渲染錯誤:', renderError);
        response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end('EJS 渲染錯誤');
      }
    }
  });
});

//3、啟動伺服器監聽8888埠
const PORT = 8888;
server.listen(PORT, function () {
  console.log(`伺服器啟動成功，訪問：http://127.0.0.1:${PORT}`);
});