const fs = require('fs');
function getSubstringRK(text, pattern)
{
    const result = [];
  
    const alphabetSize = 16000;
    const mod = 9973;
    //const mod = 1000003;
    
    let coll = 0;
    let patternHash = pattern.charCodeAt(0) % mod;
    let textHash = text.charCodeAt(0) % mod;
  
    let firstIndexHash = 1;
  
    for(let i = 1; i < pattern.length; i++) 
    {
      patternHash *= alphabetSize;
      patternHash += pattern.charCodeAt(i);
      patternHash %= mod;
  
      textHash *= alphabetSize;
      textHash += text.charCodeAt(i);
      textHash %= mod;
  
      firstIndexHash *= alphabetSize;
      firstIndexHash %= mod;
    }
  
    for (let i = 0; i <= text.length - pattern.length; i++) 
    {
      if (patternHash === textHash && compareText(text, i, pattern)) 
      {
        if (compareText(text, i, pattern)) 
        {
          result.push(i);
        }
        else
        {
          coll++;
        }
        
      }
  
      if (i === text.length - pattern.length)
      {
      break;
      }
  
      textHash -= (text.charCodeAt(i) * firstIndexHash) % mod;
      textHash += mod;
      textHash *= alphabetSize;
      textHash += text.charCodeAt(i + pattern.length);
      textHash %= mod;
    }
  
    return [result, coll];
  }

function compareText(text, index, pattern) 
{
    for (let i = 0; i < pattern.length; i++) 
    {
        if (pattern[i] !== text[index + i]) 
        {
            return false;
        }
    }
    return true;
}
  

const inputFile = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt";
const inputText = fs.readFileSync(inputFile, 'utf8');

const substr = "Андрей Болконский";

console.time("searchSubstring");
getSubstringRK(inputText, substr);
console.timeEnd("searchSubstring");


const result = getSubstringRK(inputText, substr);
console.log(result);
