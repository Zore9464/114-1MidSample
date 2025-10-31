// 1. 引入模組
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const path = require('path');

// 2. 創建 http 伺服器
http.createServer((req, res) => {
  const url = req.url;
  const ext = path.extname(url); // 取得請求網址的副檔名，用於判斷檔案類型
  console.log("收到請求網址：", url);

  // MIME 類型定義 - 建立副檔名與 Content-Type 的對應關係
  const mime = {
    '.css': 'text/css',
    '.js': 'text/javascript', 
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.ico': 'image/x-icon'
  };

  // 處理靜態檔案（CSS、JS、圖片等）
  if (mime[ext]) {
    fs.readFile('.' + url, (err, data) => {
      if (err) {
        res.writeHead(404);
        return res.end('檔案未找到');
      }
      // 設定正確的 Content-Type 讓瀏覽器能正確解析檔案
      res.writeHead(200, { 'Content-Type': mime[ext] });
      return res.end(data);
    });
    return; // 靜態檔案處理完成，結束此請求
  }

  // 使用 switch 處理不同路由
  let filePath = '';  // EJS 模板檔案路徑
  let cssFile = '';   // 對應的 CSS 檔案名稱

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
  // 讀取 EJS 模板並渲染成 HTML
  fs.readFile(filePath, 'utf8', (err, data) => {
    // 若讀取模板檔案失敗，回傳 500 伺服器錯誤
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('伺服器讀取檔案錯誤');
    }
    
    try {
      // 使用 EJS 渲染模板，傳入動態資料（CSS 檔案名稱和當前網址）
      const html = ejs.render(data, { cssFile, currentUrl: url });
      // 設定回應標頭，告訴瀏覽器這是 UTF-8 編碼的 HTML 內容
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(html);
    } catch (ejsErr) {
      // 如果 EJS 渲染過程發生錯誤，回傳 500 錯誤
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('EJS 渲染錯誤');
    }
  });
}).listen(8888, () => {
  console.log('伺服器啟動成功：http://127.0.0.1:8888');
  console.log('可訪問的路由：http://127.0.0.1:8888/calculator, 其他任意路由');
});