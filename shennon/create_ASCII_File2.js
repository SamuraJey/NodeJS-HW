const fs = require('fs');

// Открываем файл для записи
const fileName = '255.txt';
let fileContent = [];

// Добавляем символы в файл
for (let i = 0; i < 256; i++) {
  let char = String.fromCharCode(i);
  console.log(char);
  let line = char.repeat(i);
  fileContent.push(line);
}

// Записываем файл
fs.writeFileSync(fileName, fileContent.join('\n'), "utf-8");
fs.writeFileSync("ge.txt", String.fromCharCode(0), "utf-8");
console.log(`done`);
