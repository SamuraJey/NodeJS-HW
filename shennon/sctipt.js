const fs = require('fs');
let arg = process.argv;

// Считываем текстовый файл
//const text = "abrakadabra"
const text = fs.readFileSync(arg[2],"utf-8")

// Подсчет количества каждого символа в файле
const charCount = {}; // словарь

function getBaseLog(x, y) 
{
    return Math.log(y) / Math.log(x);
}
  

for (let i = 0; i < text.length; i++)
{
    let char = text[i];
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
//let entropy2 = 0;
let entropy3 = 0;
let len = text.length;

const objectLength = Object.keys(charCount).length;
console.log(objectLength); // 4
console.log(objectLength);

for (let char in charCount)
{
    var prob = charCount[char] / len;
    entropy += -prob * Math.log2(prob);
    //loger = getBaseLog(prob, charCount.length);
    entropy3 += -prob * Math.log(prob) / Math.log(objectLength);
    
}

console.log(`Энтропия: ${entropy}`);
//console.log(`Энтропия2: ${entropy2}`);
console.log(`Энтропия3: ${entropy3}`);