function boyerMooreHorspool(haystack, needle) {
    const table = {};
    const res = [];
    const n = haystack.length;
    const m = needle.length;
    let i = 0;
    haystack = haystack.toLowerCase();
    needle = needle.toLowerCase();
    
    // создаем таблицу смещений для алгоритма
    for (let j = 0; j < m; j++) 
    {
        table[needle[j]] = m - j - 1;
    }


    for (let i in table)
    {
        console.log(i + " " + table[i]);
    }
    // проходим по строке, сравнивая подстроку с иголкой
    while (i <= n - m) {
      let j = m - 1;
      while (j >= 0 && needle[j] === haystack[i + j]) 
      {
            j--;
      }
      if (j === -1) 
      {
        res.push(i);
        i++;
      } 
      else 
      {
        const shift = table[haystack[i + j]] || m;
        i += shift;
      }
    }
  
    return res;
  }
  
  // пример использования

const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
// inputText = inputText.toLowerCase();
let inputSubStr = "Андрей Болконский"
// inputSubStr = inputSubStr.toLowerCase();
console.log(inputSubStr);

for(let i = 290030; i < 290030 + inputSubStr.length; i++)
{
    console.log(inputText[i]);
}

console.time("boyerMooreHorspool");
const index = boyerMooreHorspool(inputText, inputSubStr);
console.timeEnd("boyerMooreHorspool");
console.log(index);