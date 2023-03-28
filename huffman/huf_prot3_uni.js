const fs = require("fs");
const arg = process.argv;
const [mode] = process.argv.slice(2);
//ВСЕ ЧТО ЗАКОМЕНТИРОВАНО НЕ НУЖНО)) ПОТОМ УДАЛЮ И ЭТОТ КОММЕНТ ТОЖЕ

if (mode.toLowerCase() == "code") 
{
    fs.writeFileSync("jopa.txt", "");
    const [fileInput, fileOutput, fileHelp] = process.argv.slice(3);
    var compressed2 = "";
    var end = "";



    function splitAndConvert(str) {
      // Дополнить строку нулями до кратности 16
      while (str.length % 16 !== 0) 
      {
        str += 0;
      }
    
      // Разбить строку на части по 16 символов
      const chunks = str.match(/.{1,16}/g);
    
      // Преобразовать каждую часть в десятичное число и потом в строку символов UTF-16
      const utf16Strings = chunks.map(chunk => 
        {
        const decimal = parseInt(chunk, 2);
        return String.fromCharCode(decimal);
      });
    
      // Склеить все строки символов UTF-16 в одну строку и вернуть её
      return utf16Strings.join('');
    }

    function freqs(text)
    {
      // Считаем частоту каждого символа
      return [...text].reduce(function (fs, c)
      {
        return fs[c] ? (fs[c] = fs[c] + 1, fs) : (fs[c] = 1, fs);
      }, {});
    }

    function topairs(freqs)
    {
      var pairs = Object.keys(freqs).map(
      function(c)
      {
        return [c, freqs[c]];
      });
      return pairs;
    }

    function sortPairs(pairs)
    {
      return pairs.sort(
        function(a, b)
        {
        return a[1] - b[1];
        });
    }
    
    function tree(ps) {
      if (ps.length < 2) {
      return ps[0];
      } else {
      const sortedPairs = sortPairs([[ps.slice(0, 2), ps[0][1] + ps[1][1]]].concat(ps.slice(2)));
      return tree(sortedPairs);
      }
      }

    function codes(tree, pfx)
    {
      const codeObj = {};
      if (!pfx)
      pfx = "";
      
      if (tree[0] instanceof Array)
      {
      const leftTree = tree[0][0];
      const rightTree = tree[0][1];
      const leftCodes = codes(leftTree, pfx + "0");
      const rightCodes = codes(rightTree, pfx + "1");
      Object.assign(codeObj, leftCodes, rightCodes);
      } 
      else
      {
      const symbol = tree[0];
      codeObj[symbol] = pfx;
      }
      return codeObj;
      }

      function getCodes(text) {
        const frequencies = freqs(text);
        const pairs = topairs(frequencies);
        const sortedPairs = sortPairs(pairs);
        const codingTree = tree(sortedPairs);
        const codess = codes(codingTree);
        return codess;
        }
    
    let textInput = fs.readFileSync(fileInput, "utf-8");
    let treeCodes = {};
  
    if (new Set(textInput).size == 1)
    {
      treeCodes[textInput.charAt(0)] = "0";
    }
    else
    {
      treeCodes = getCodes(textInput);
    }
    
    fs.writeFileSync(fileOutput, "");
    
    for (i of textInput)
    {
      //console.log(treeCodes[i]);
      if (i !== "╬") 
      {
        compressed2 += treeCodes[i];
      } 
      else 
      {
        compressed2 += treeCodes[i];
      }
      
      //fs.appendFileSync(fileOutput, treeCodes[i]);
    }
    console.log(compressed2);
  
    function swapKeyWithValue(obj)
    {
      const ret = {};
      const keys = Object.keys(obj);
      for (let i = 0; i < keys.length; i++)
      {
      const key = keys[i];
      const value = obj[key];
      ret[value] = key;
      }
      return ret;
    }

    //console.log(splitAndConvert(compressed2));
    for (const i of splitAndConvert(compressed2)) 
  {
    //console.log(i.charCodeAt(0).toString(2));
    console.log(i);
    fs.appendFileSync(fileOutput, i);
  }
    
    // json файл для декодировки
    fs.writeFileSync(fileHelp, JSON.stringify(swapKeyWithValue(treeCodes)));
} 
else if (mode.toLowerCase() == "decode")
{
    const [, , mode, fileInput, fileHelp, fileOutput] = process.argv;
    let textInput = fs.readFileSync(fileInput, "utf-8");
    let treeCodes = JSON.parse(fs.readFileSync(fileHelp, "utf-8"));
    let binInput = "";

/*
  function decodeHuffman(binaryString, tree)
  {
    let decodedBits = "";
    let i = 0;
    console.log(tree);
    while (i < binaryString.length) {
      var node = tree;
      while (typeof node === "object") 
      {
        if (binaryString[i] === "0") 
        {
          node = node.left;
        } 
        else if (binaryString[i] === "1") 
        {
          node = node.right;
        } else 
        {
          console.error("Error: invalid input");
          return "";
        }
        i++;
      }
      decodedBits += node;
      //console.log(node);
    }
  
    let decodedChars = "";
    for (let i = 0; i < decodedBits.length; i += 16) 
    {
      let charCode = parseInt(decodedBits.substr(i, 16), 2);
      //console.log(decodedBits.substr(i, 16));
      decodedChars += String.fromCharCode(charCode);
    }
    //console.log(decodedChars);
    return decodedChars;
  }
  */
 /*
    function addLeadingZeros(str) 
    {
      while (str.length % 16 !== 0) {
        str = '0' + str;
      }
      return str;
    }
*/
    function decodeHaffman(encodedText, treeCodes) {
      let decodedBits = "";
      let decodedChars ="";
      for (let i = 0; i < encodedText.length; i++) {
        let bit = encodedText[i];
        decodedBits += bit;
        if (decodedBits in treeCodes) {
          let char = treeCodes[decodedBits];
          if (char === "╬") {
            break;
          }
          decodedChars += char;
          decodedBits = "";
        }
      }
      return decodedChars;
    }
    
    for (let j = 0; j < textInput.length; j++) 
    {
      binInput += textInput.charCodeAt(j).toString(2).padStart(16, "0");
      //console.log(binInput);
    }
    console.log(binInput);
    let decodedString = decodeHaffman(binInput, treeCodes);

    console.log(decodedString);
    fs.appendFileSync(fileOutput, decodedString);

    /* херота
    for (let j = 0; j < textInput.length; j++) 
    {
      binInput += textInput.charCodeAt(j).toString(2) 
    }
    textInput = addLeadingZeros(binInput);
    */
   /*
    let i = 0;
    let fullyDecoded = false; // флаг, который станет true, когда текст будет полностью расшифрован
    while (i < textInput.length && !fullyDecoded)
    { // добавляем проверку на флаг в условие цикла
        let codeFound = false; // флаг, который станет true, когда символ будет найден
        for (code in treeCodes)
        {
            if (textInput.startsWith(code, i))
            {
              
              if (treeCodes[code] == "╬") 
              {
                console.log("her");
                break
              }
                fs.appendFileSync(fileOutput, treeCodes[code]);
                i += code.length;
                codeFound = true; // устанавливаем флаг, что символ найден
                break; // добавляем break, чтобы выйти из цикла for, когда символ найден
            }
        }
        if (!codeFound)
        { // проверяем, был ли найден какой-либо символ
            //console.error("Error: failed to decode input text");
            break; // выходим из цикла while в случае, если символ не был найден
        }
    }*/
} 
else if (mode.toLowerCase() == "test") 
{
  let fileInput = arg[3];
  let fileOutput = arg[4];

  if (fs.readFileSync(fileInput, "utf-8") === fs.readFileSync(fileOutput, "utf-8"))
  {
    console.log("success!")
  } 
  else 
  {
    console.log(":(")
  }
}
else
{
  console.error("Wrong arguments given");
  process.exit(1);
}
