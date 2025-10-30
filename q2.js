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