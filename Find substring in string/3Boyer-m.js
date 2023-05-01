function boyerMooreHorspool(text, pattern) {
    const m = pattern.length;
    const n = text.length;
    let res = [];
    let tmp = [];
  
    if (m > n) {
      return res;
    }
  
    const badMatchTable = new Map();
    for (let i = 0; i < m - 1; i++) {
      badMatchTable.set(pattern[i], m - i - 1);
    }
  
    let i = 0;
    while (i <= n - m) {
      let j = m - 1;
  
      while (j >= 0 && pattern[j] === text[i + j]) {
        j--;
      }
  
      if (j === -1) 
      {
        res.push(i);
        console.log(i);
        i += 1;
      } else 
      {
            const badMatchSkip = badMatchTable.get(text[i + j]) || m;
            i += badMatchSkip;
      }
    }
  
    return res;
  }
  
  // Пример использования:
//   const pattern = "Андрей Болконский";
//   const text = "Война и мир – один из самых известных романов Льва Николаевича Толстого. В романе много персонажей, включая Андрея Болконского, Пьера Безухова и Наташу Ростову. Андрей Болконский встречается несколько раз в романе.";
//   const indices = boyerMooreHorspool(pattern, text);
//   console.log(indices);  // [52, 157, 203, 231]
  
  
  const fs = require('fs');

  let inputText = fs.readFileSync("C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt", 'utf8');
  //inputText = "Андрей Болконский встречается несколько раз в романе."
  let inputSubStr = "Андрей Болконский"
  
  console.time("boyerMooreHorspool");
  const index = boyerMooreHorspool(inputText, inputSubStr);
  console.timeEnd("boyerMooreHorspool");
  console.log(index); 
  