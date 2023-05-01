const fs = require('fs');
function rabinKarp(string, substring) {
    const M = 1000003;
    let collisions = 0;
    let substringHash = getHashRK(substring, M);
    let result = [];
    for (let i = 0; i <= string.length - substring.length; i++) {
    let currentHash = getHashRK(string.slice(i, i + substring.length), M);
    if (currentHash === substringHash) {
    let currentSubstring = string.slice(i, i + substring.length);
    if (currentSubstring === substring) {
    result.push(i);
    if (result.length === 10) {
    break;
    }
    } else {
    collisions++;
    }
    }
    }
    if (result.length === 0) {
    result.push(-1);
    return [result, collisions];
    }
    return [result, collisions];
    }
    
    function getHashRK(str, mod) {
    let hash = 0;
    const p = 1 << (str.length - 1);
    for (let i = 0; i < str.length; i++) {
    hash = ((hash * 2) % mod + str.charCodeAt(i)) % mod;
    }
    return hash;
    }
  
  


  
      



const inputFile = "warandpeace.txt";
const inputText = fs.readFileSync(inputFile, 'utf8');

const substr = "Андрей Болконский";


console.time("searchSubstringRK");
const [resultRK, collisionsRK] = rabinKarp(inputText, substr);
console.timeEnd("searchSubstringRK");

console.log();
console.log("Результат поиска: Rabin-Karp:", resultRK);
console.log("Количество коллизий Rabin-Karp:", collisionsRK);