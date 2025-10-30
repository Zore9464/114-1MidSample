


const products = [
  { name: "keyboard", stock: 25 },
  { name: "mouse", stock: 5 },
  { name: "monitor", stock: 8 },
  { name: "usb cable", stock: 40 }
];

function getLowStock(products) {
  return products
    .filter(product => product.stock < 10)
    .map(product => product.name);
}

console.log(getLowStock(products)); // ["mouse", "monitor"]

function updateStock(products, updates) {
  // 依照 updates 更新對應商品的庫存
  for (let product of products) {
    if (updates.hasOwnProperty(product.name)) {
      product.stock = updates[product.name];
    }
  }

  // 輸出結果
  for (let product of products) {
    console.log(`${product.name} 的庫存： ${product.stock}`);
  }

  // 若要讓 console.log(updateStock(...)) 有輸出，可以回傳字串或陣列
  return products;
}

  const updates = { mouse: 15, monitor: 20 };
  updateStock(products, updates);