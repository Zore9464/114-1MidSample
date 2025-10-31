// 1. 引入模組
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// 2. 建立伺服器
http.createServer((req, res) => {
  const url = req.url;
  const ext = path.extname(url); ///這行是用來取得「使用者請求的網址」的副檔名。

  // 處理靜態檔案
  const mime = { ///用來對應「副檔名」→「回傳時要告訴瀏覽器的檔案格式」。
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
  };

  if (mime[ext]) { // 如果請求的網址是靜態檔案
    fs.readFile('.' + url, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('檔案未找到');
      }
      res.writeHead(200, { 'Content-Type': mime[ext] }); /// 這行是用來告訴瀏覽器回傳的檔案格式
      return res.end(data);
    });
    return;
  }

  // 使用 switch 路由
  let filePath = '';
  let cssFile = '';

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
      filePath = './index3.ejs';
      cssFile = 'style3.css';
      break;
  }

  // 讀取與渲染 EJS
  fs.readFile(filePath, 'utf8', (err, data) => {
    // 若讀取檔案出錯（例如檔案不存在），伺服器會回傳 500 錯誤（Internal Server Error）給瀏覽器：
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('伺服器讀取檔案錯誤');
    }
    // ejs.render() 是 EJS 模板引擎 提供的函式
    try {
      const html = ejs.render(data, { cssFile, currentUrl: url });
      /// Tell 瀏覽器 這是一個 HTML 頁面，使用 UTF-8 編碼
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
      /// 如果在 EJS 渲染過程中出現錯誤回傳EJS 渲染錯誤
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('EJS 渲染錯誤');
    }
  });
}).listen(8888, () => {
  console.log('伺服器啟動成功：http://127.0.0.1:8888');
});