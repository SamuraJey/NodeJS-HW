function getSubstringRK(text, pattern) {
    const result = [];
  
    const alphabetSize = 256;
    const mod = 9973;
  
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
        result.push(i);
      }
  
      if (i === text.length - pattern.length) break;
  
      textHash -= (text.charCodeAt(i) * firstIndexHash) % mod;
      textHash += mod;
      textHash *= alphabetSize;
      textHash += text.charCodeAt(i + pattern.length);
      textHash %= mod;
    }
  
    return result;
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
  
  // test for Rabin-Karp
    const text = 'Hello ';
    const pattern = 'world';
    const result = getSubstringRK(text, pattern);
    console.log(result);
