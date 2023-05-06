function boyerMooreHorspool(text, pattern) 
{

    const m = pattern.length;
    const n = text.length;
    const skip = {};
    let result = [];

    if (m > n) 
    {
        result.push(-1);
        return result;
    }
  
    for (let i = 0; i < m - 1; i++) 
    {
        skip[pattern[i]] = m - i - 1;
    }
  
    let i = 0;
    while (i <= n - m) 
    {
        let j = m - 1;
        while (j >= 0 && pattern[j] === text[i + j]) 
        {
            j--;
        }
        if (j === -1) 
            {
                result.push(i);
                i++;
            } 
        else 
        {
            const char = text[i + j];
            const charSkip = skip[char] || m;
            i += charSkip;
        }
    }
  
    return result;
}

const buildBadMatchTable = (str) => {
    const tableObj = {}
    const strLength = str.length
    for (let i = 0; i < strLength - 1; i++) {
      tableObj[str[i]] = strLength - 1 - i
    }
    if (tableObj[str[strLength - 1]] === undefined) {
      tableObj[str[strLength - 1]] = strLength
    }
    return tableObj
  }

const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "Андрей Болконский"

console.log(buildBadMatchTable(inputSubStr));
console.time("boyerMooreHorspool");
const index = boyerMooreHorspool(inputText.toLowerCase(), inputSubStr.toLowerCase());
console.timeEnd("boyerMooreHorspool");
console.log(index);