const fs = require('fs');
const arg = process.argv;

// Считываем текстовый файл
const text = fs.readFileSync(arg[2], "utf-8")
const textLenght = text.length;
// Подсчет количества каждого символа в файле
const charCount = {}; // словарь

for (let i = 0; i < textLenght; i++)
{
    const char = text[i];
    if (charCount[char])
    {
        charCount[char] += 1;
    }
    else
    {
        charCount[char] = 1;
    }
}


let entropy = 0;
let entropy2 = 0;

const objectLength = Object.keys(charCount).length;

for (const char in charCount)
{
    const prob = charCount[char] / textLenght;
    entropy += -prob * Math.log2(prob);
    entropy2 = objectLength == 1 ? 0 : entropy2 += -prob * Math.log(prob) / Math.log(objectLength);

}

console.log(`Энтропия: ${entropy}`);
console.log(`Энтропия2: ${entropy2}`);