const fs = require("fs");
const arg = process.argv;
const [mode] = process.argv.slice(2);


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

    /*
    const freqs = text =>
    { // Считаем частоту каждого символа
      return [...text].reduce((fs, c) => fs[c] ? (fs[c] = fs[c] + 1, fs) : (fs[c] = 1, fs), {})
    }
    */

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

    fs.appendFileSync(fileOutput, i.charCodeAt(0).toString(2));
  }
    /*
    for (let i = 0; i < compressed2.length; i += 16) 
    {
      var compressed3 ='';
      //console.log(compressed2.length - i);
      //console.log(compressed2.length - i);
      if (compressed2.length - i > 16) 
      {
        //console.log(i);
        end += compressed2.slice(i, i + 16); // в енд записывается разбиение по 16 бит
        //compressed3 += String.fromCharCode(parseInt(end.slice(i, i + 16), 2));
        //compressed3 += String.fromCharCode(parseInt(end.slice(i, i + 16), 2) + 500);

        //console.log(parseInt(end.slice(i, i + 16), 2) + 255);
        //console.log(String.fromCharCode(parseInt(end.slice(i, i + 16), 2) + 500));
        //console.log(compressed2);
        //fs.appendFileSync("jopa.txt", compressed3);
       // console.log(end);

      }
      else
      {
        //console.log(i);
        //console.log(compressed2.length);
        //console.log("jopa");
        end += compressed2.slice(i, compressed2.length)
        //console.log(end);
        end += treeCodes["╬"].repeat(16 - (compressed2.length - i))
        //end += "2".repeat(16 - (compressed2.length - i))
        //console.log(end);
      }
      //console.log("end: ", end);
      //console.log(end.slice(i, i + 16));
      compressed3 += compressed3 + String.fromCharCode(parseInt(end.slice(i, i + 16), 2) + 500);
      console.log("compressed3: ", compressed3);
      fs.appendFileSync("jopa.txt", compressed3);
    }
    //console.log(compressed3);
    console.log((compressed3.codePointAt(0)-500).toString(2));
    console.log("cmp2: ",compressed2);
    var her = fs.readFileSync("jopa.txt", "utf-8")
    for (let j of her) 
    {
      console.log();
      console.log((j.codePointAt(0)-500).toString(2));
      
    }
*/
    
    // json файл для декодировки
    fs.writeFileSync(fileHelp, JSON.stringify(swapKeyWithValue(treeCodes)));
} 
else if (mode.toLowerCase() == "decode")
{
    const [, , mode, fileInput, fileHelp, fileOutput] = process.argv;
    let textInput = fs.readFileSync(fileInput, "utf-8");
    let treeCodes = JSON.parse(fs.readFileSync(fileHelp, "utf-8"));
    
    let i = 0;
    let fullyDecoded = false; // флаг, который станет true, когда текст будет полностью расшифрован
    while (i < textInput.length && !fullyDecoded)
    { // добавляем проверку на флаг в условие цикла
        let codeFound = false; // флаг, который станет true, когда символ будет найден
        for (code in treeCodes)
        {
            if (textInput.startsWith(code, i))
            {
              
              if (treeCodes[code] == "╬") {
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
    }
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
