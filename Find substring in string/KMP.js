function kmp(string, subString)
{
    const strLen = string.length;
    const subStrLen = subString.length;
    const lps = computeLPS(subString);
    const res = [];

    let strIndex = 0; // индекс в тексте
    let subStrIndex = 0; // индекс в подстроке

    while (strIndex < strLen) // пока не конец текста
    {
        if (subString[subStrIndex] === string[strIndex]) // если символы совпадают то двигаемся дальше
        {
            strIndex++;
            subStrIndex++;
        }
        if (subStrIndex === subStrLen) // если вся подстрока совпала, то добавляем индекс вхождения в массив
        {
            // Найдено вхождение подстроки
            res.push(strIndex - subStrIndex);
            subStrIndex = lps[subStrIndex - 1];
        }
        else if (strIndex < strLen && subString[subStrIndex] !== string[strIndex]) // если символы не совпадают
        {
            if (subStrIndex !== 0) // если не в начале подстроки, то сдвигаемся по lps
            {
                subStrIndex = lps[subStrIndex - 1]; // сдвигаемся по lps
            }
            else
            {
                strIndex++; // иначе двигаемся дальше по тексту
            }
        }
    }

    if (res.length === 0)
    {
        //res.push(-1);
        return [-1];
    }
    return res;
}

function computeLPS(pattern) {
    const m = pattern.length;
    const lps = new Array(m).fill(0);
  
    let len = 0;
    let i = 1;
  
    while (i < m) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
    console.log(lps);
    return lps;
  }

const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
//inputText = "aranananas"
// inputText = inputText.toLowerCase();
let inputSubStr = "Андрей Болконский"
// inputSubStr = inputSubStr.toLowerCase();

console.time("kmp");
const index = kmp(inputText, inputSubStr);
console.timeEnd("kmp");
console.log(index);
