function buildBadMatchTable(text) 
{
    const table = {};
    const strLen = text.length;
    for (let i = 0; i < strLen - 1; i++) 
    {
        table[text[i]] = strLen - i - 1;
    }
    if (table[text[strLen - 1]] === undefined)
    {
        table[text[strLen - 1]] = strLen;
    }
    return table;
}

function boyerMoore(text, pattern)
{
    const badMatchTable = buildBadMatchTable(pattern) // Создаем таблицу смещейний
    let offset = 0 // Смещение
    let res = []; 
    const patternLastIndex = pattern.length - 1; // Индекс последнего символа подстроки
    const maxOffset = text.length - pattern.length; // Максимальное смещение
    if (maxOffset < 0) return -1 // Если длина подстроки больше длины строки, то нет смысла искать
    while (offset <= maxOffset) 
    {
        let scanIndex = 0;
        while (pattern[scanIndex] === text[scanIndex + offset]) 
        {
            if (scanIndex === patternLastIndex) // Если вся подстрока совпала, то добавляем индекс вхождения в массив
            {
                res.push(offset);
            }
            scanIndex++;
        }
        const badMatchString = text[offset + patternLastIndex];
        if (badMatchTable[badMatchString]) 
        {
            offset += badMatchTable[badMatchString];
        } 
        else 
        {
            offset++;
        }
    }
    if (res.length != 0) 
    {
        return res;
    }
    else 
    {
        res.push(-1);
        return res;
    }

}

const fs = require('fs');
let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "Андрей Болконский";
let strt = performance.now();
  console.log(boyerMoore(inputText, inputSubStr))
let end = performance.now();
console.log(end - strt);
