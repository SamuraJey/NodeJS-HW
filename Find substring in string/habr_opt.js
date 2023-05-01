const fs = require('fs');
function getSubstring(text, pattern) {
    const result = [];
    const alphabetSize = 256;
    //const mod = 9973;
    const mod = 1000003;
  
    let patternHash = 0;
    let textHash = 0;
  
    // Precompute the hash of the pattern and the first substring of the text.
    for (let i = 0; i < pattern.length; i++) {
      patternHash = (patternHash * alphabetSize + pattern.charCodeAt(i)) % mod;
      textHash = (textHash * alphabetSize + text.charCodeAt(i)) % mod;
    }
  
    // Compute the hash of each subsequent substring of the text and check if it matches the pattern hash.
    for (let i = 0; i <= text.length - pattern.length; i++) {
      if (patternHash === textHash) {
        // Check if the substrings actually match.
        let j = 0;
        for (; j < pattern.length; j++) {
          if (pattern[j] !== text[i + j]) {
            break;
          }
        }
        if (j === pattern.length) {
          result.push(i);
        }
      }
  
      // Compute the hash of the next substring of the text.
      textHash = ((textHash - text.charCodeAt(i) * Math.pow(alphabetSize, pattern.length - 1)) * alphabetSize + text.charCodeAt(i + pattern.length)) % mod;
    }
  
    return [result, result.length - 1];
  }
  
  

const inputFile = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt";
const inputText = fs.readFileSync(inputFile, 'utf8');

const substr = "Андрей Болконский";

console.time("searchSubstring");
getSubstring(inputText, substr);
console.timeEnd("searchSubstring");


const result = getSubstring(inputText, substr);
console.log(result);
