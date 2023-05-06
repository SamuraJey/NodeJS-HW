function findSubstring(str, substr)
{
    let res = [];
    let strLen = str.length;
    let subStrLen = substr.length;
    let prefix = prefixFunction(substr);
    let j = 0;
    for (let i = 0; i < strLen; i++)
    {
        while (j > 0 && str[i] !== substr[j])
        {
            j = prefix[j - 1];
        }
        if (str[i] === substr[j])
        {
            j++;
        }
        if (j === subStrLen)
        {
            res.push(i - subStrLen + 1);
            j = prefix[j - 1];
        }
    }
    if (res.length === 0)
    {
        res.push(-1);
        return res;
    }
    return res;
}

function prefixFunction(substr)
{
    const subStrLen = substr.length;
    let prefix = new Array(subStrLen).fill(0);
    let j = 0;
    for (let i = 1; i < subStrLen; i++)
    {
        while (j > 0 && substr[i] !== substr[j])
        {
            j = prefix[j - 1];
        }
        if (substr[i] === substr[j])
        {
            j++;
        }
        prefix[i] = j;
    }
    return prefix;
}


const fs = require('fs');

let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "aaaananananananaaaaaa"

let str = "hello world";
let substr = "l";
console.time("1")
let res = findSubstring(inputText, inputSubStr);
console.timeEnd("1")
console.log(res); // [2, 3, 9]