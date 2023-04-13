const fs = require('fs');
const charCount = 255;
let fileContent = "";

// Генерируем символы в соответствии с заданными условиями
for (let i = 0; i < charCount; i++) {
  let char = String.fromCharCode(i % 256);
  let count = i + 1;
  fileContent += char.repeat(count) + "\n";
}

// Записываем содержимое файла в один проход
fs.writeFileSync('text.txt', fileContent);
