const fs = require('fs');

function boyerMooreHorspool(string, subStr) // Алгоритм Бойера-Мура-Хорспула
{
    const strLen = string.length;
    const subStrLen = subStr.length;
    let res = [];
    if (subStrLen > strLen) // если длина подстроки больше длины строки, то подстрока не может быть в строке
    {
        res.push(-1);
        return res;
    }
    const offsetTable = {}; // таблица смещений
    for (let i = 0; i < subStrLen - 1; i++) // заполняем таблицу смещений
    {
      offsetTable[subStr[i]] = subStrLen - i - 1; // формула для заполнения таблицы смещений (длина подстроки - индекс символа в подстроке - 1)
    }
    //need to sort offsetTable

    //offsetTable[subStr[subStrLen - 1]] = subStrLen; // заполняем последний элемент таблицы смещений
    //console.log(offsetTable);
    let i = subStrLen - 1;
    while (i < strLen) 
    {
      let j = subStrLen - 1;
      while (string[i] === subStr[j])
      {
        if (j === 0)
        {
            res.push(i);
        }
        i--;
        j--;
      }
      const offset = offsetTable[string[i]];
      //console.log(offset);
      i += offset !== undefined ? offset : subStrLen;
    }
    if (res.length > 0)
    {
        return res;
    }
    else
    {
        res.push(-1);
        return res;
    }
}



inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
inputSubStr = "Андрей Болконский"



console.time("boyerMooreHorspool");
const index = boyerMooreHorspool(inputText, inputSubStr);
console.timeEnd("boyerMooreHorspool");
console.log(index); // 16