function getSubstringRK(text, pattern) {
    const result = [];
    const alphabetSize = 256;
    const mod = 9973;
    let patternHash = 0;
    let textHash = 0;
    let firstIndexHash = 0;
    let collisions = 0;
  
    for (let i = 0; i < pattern.length; i++) {
      patternHash = (patternHash * alphabetSize + pattern.charCodeAt(i)) % mod;
      textHash = (textHash * alphabetSize + text.charCodeAt(i)) % mod;
      firstIndexHash = (firstIndexHash * alphabetSize) % mod;
    }
  
    for (let i = 0; i <= text.length - pattern.length; i++) {
      if (i === 0) {
        for (let j = 0; j < pattern.length; j++) {
          firstIndexHash = (firstIndexHash * alphabetSize) % mod;
        }
      } else {
        textHash = ((textHash - text.charCodeAt(i - 1) * firstIndexHash) * alphabetSize +
          text.charCodeAt(i + pattern.length - 1)) % mod;
        if (textHash < 0) textHash += mod;
        collisions++;
      }
  
      if (patternHash === textHash) {
        let j = 0;
        for (j = 0; j < pattern.length; j++) {
          if (text.charAt(i + j) !== pattern.charAt(j)) break;
        }
        if (j === pattern.length) result.push(i);
      }
    }
    return [result, collisions];
  }
  
    // test for Rabin-Karp
    const text = 'Hello world';
    const pattern = 'world';
    const result = getSubstringRK(text, pattern)[0];
    console.log(result);