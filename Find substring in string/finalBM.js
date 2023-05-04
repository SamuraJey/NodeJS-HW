function boyerMooreSearch(text, pattern)
{
    let res = [];
    const strLength = text.length;
    const subStrLength = pattern.length;
    if (subStrLength === 0 || strLength === 0 || subStrLength > strLength) 
    {
        res.push(-1);
        return res;
    }

    let charTable = makeCharTable(pattern);
    let offsetTable = makeOffsetTable(pattern);

    for (let i = subStrLength - 1, j; i < strLength;) 
    {
        for (j = subStrLength - 1; pattern[j] == text[i]; i--, j--) 
        {
            if (j === 0) 
            {
                res.push(i);
                break;
            }
        }
        const charCode = text.charCodeAt(i);
        i += Math.max(offsetTable[subStrLength - 1 - j], charTable[charCode]);
    }

    if (res.length === 0)
    {
        res.push(-1);
        return res;
    }
    return res;
}

/**
 * Creates jump table, based on mismatched character information
 */
function makeCharTable(pattern){
    let table = [];

    // 65536 being the max value of char + 1
    for (let i = 0; i < 65536; i++) 
    {
        table.push(pattern.length);
    }

    for (let i = 0; i < pattern.length - 1; i++) {
        const charCode = pattern.charCodeAt(i);
        table[charCode] = pattern.length - 1 - i;
    }

    return table;
}


function makeOffsetTable(pattern) 
{
    const patternLength = pattern.length;
    let table = new Array(patternLength);
    let lastPrefixPosition = patternLength;

    for (let i = patternLength; i > 0; i--) 
    {
        if (isPrefix(pattern, i)) 
        {
            lastPrefixPosition = i;
        }
        table[patternLength - i] = lastPrefixPosition - 1 + patternLength;
    }

    for (let i = 0; i < patternLength - 1; i++) 
    {
        const slen = suffixLength(pattern, i);
        table[slen] = patternLength - 1 - i + slen;
    }
    return table;
}

function isPrefix(pattern, pos) 
{
    for (let i = pos, j = 0; i < pattern.length; i++, j++) 
    {
        if (pattern[i] != pattern[j]) 
        {
            return false;
        }
    }
    return true;
}

function suffixLength(pattern, pos) 
{
    let len = 0;

    for (let i = pos, j = pattern.length - 1; i >= 0 && pattern[i] == pattern[j]; i--, j--) 
    {
        len += 1;
    }
    return len;
}


const fs = require('fs');
let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');

let inputSubStr = "Андрей Болконский";
let strt = performance.now();
console.log(boyerMooreSearch(inputText, inputSubStr))
let end = performance.now();
console.log(end - strt);