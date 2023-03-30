const fs = require("fs");
const arg = process.argv;
const [mode] = process.argv.slice(2);
//ВСЕ ЧТО ЗАКОМЕНТИРОВАНО НЕ НУЖНО)) ПОТОМ УДАЛЮ И ЭТОТ КОММЕНТ ТОЖЕ

if (process.argv.length !== 6) //проверяем что нам дали нужное кол-во аргументов
{
    console.error('Usage in code mode: \nnode app.js <mode> <inputfile.txt> <outputFile.txt> <outputTree.json>');
    console.error();
    console.error('Usage in decode mode: \nnode app.js <mode> <inputFile.txt> <inputTree.json> <outputFile.txt> ');
    process.exit(1);
}

function FileExist(inpFile) // Проверяем, существует ли входной файл
{
    if ((fs.existsSync(inpFile))) 
    return true;
    else return false;
}

if (mode.toLowerCase() == "code") 
{
    const [fileInput, fileOutput, fileHelp] = process.argv.slice(3);
    var compressed2 = "";
    //var end = "";

    if (!(FileExist(fileInput))) 
    {
        console.error(`Обнаружена ошибка. Файл ${fileInput} или не найден`)
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }

    function splitAndConvert(str) //Функция которая разделяет бинарную последовательность на части по 16, добивает нулями если <16, и конверитрует в символ юникода.
    {
        // Дополнить строку нулями до кратности 16
        while (str.length % 16 !== 0) 
        {
            str += 0;
        }
    
      // Разбить строку на части по 16 символов
      const chunks = str.match(/.{1,16}/g);
    
      // Преобразовать каждую часть в десятичное число и потом в массив строк (состоящих из 1 стмвола) UTF-16
    const utf16Strings = chunks.map(chunk => {
        const decimal = parseInt(chunk, 2);
        return String.fromCharCode(decimal);});
      // Склеить все строки символов UTF-16 в одну строку и вернуть её
      return utf16Strings.join('');
    }

    /*
    function freqs(text)
    {
      // Считаем частоту каждого символа
      return [...text].reduce(function (fs, c)
      {
        return fs[c] ? (fs[c] = fs[c] + 1, fs) : (fs[c] = 1, fs);
      }, {});
    }
    */
    function freqs(text) 
    {
        const freq = {};
        for (const c of text)
        {
          freq[c] = (freq[c] || 0) + 1;
        }
        return freq;
      }
      
/*
    function topairs(freqs)
    {
      var pairs = Object.keys(freqs).map(
      function(c)
      {
        return [c, freqs[c]];
      });
      return pairs;
    }
*/
    function topairs(freqs)
    {
        var pairs = [];
        for (var c in freqs)
        {
            pairs.push([c, freqs[c]]);
        }
        return pairs;
    }

    
    function sortPairs(pairs)
    {
        //console.log(pairs);
      return pairs.sort(
        function(a, b)
        {
            return a[1] - b[1];
        });
    }
    
    function tree(ps)
    {
        if (ps.length < 2) 
        {
            return ps[0];
            
        } 
        else
        {
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

    function getCodes(text)
    {
        const frequencies = freqs(text);
        const pairs = topairs(frequencies);
        const sortedPairs = sortPairs(pairs);
        const codingTree = tree(sortedPairs);
        const codess = codes(codingTree);
        //console.log(codess);
        return codess;
    }
    
    let textInput = fs.readFileSync(fileInput, "utf-8");
    let treeCodes = {};
  
    treeCodes = getCodes(textInput);
    fs.writeFileSync(fileOutput, "");
    
    for (i of textInput)
    {
        compressed2 += treeCodes[i];
    }
    console.log(compressed2);
  
    function swapKeyWithValue(obj) //для удобства меняем ключ и значение местами
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

    
    for (const i of splitAndConvert(compressed2)) 
    {
        //console.log(i);
        fs.appendFileSync(fileOutput, i);
    }
    // json файл для декодировки
    fs.writeFileSync(fileHelp, JSON.stringify(swapKeyWithValue(treeCodes)));
} 
else if (mode.toLowerCase() == "decode")
{
    const [, , mode, fileInput, fileHelp, fileOutput] = process.argv;
    
    if (!(FileExist(fileInput)) || !(FileExist(fileHelp))) 
    {
        console.error(`Обнаружена ошибка. Файл ${fileInput} или ${fileHelp} не найден`)
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }

    let textInput = fs.readFileSync(fileInput, "utf-8");
    let treeCodes = JSON.parse(fs.readFileSync(fileHelp, "utf-8"));
    let binInput = "";

    // Функция декодирует битовую строку с использованием дерева Хаффмана,
    // которое представлено в виде объекта treeCodes с кодами символов
    function decodeHaffman(encodedText, treeCodes)
    {
        let decodedBits = "";
        let decodedChars = "";
        for (let i = 0; i < encodedText.length; i++) 
        {
            let bit = encodedText[i];
            decodedBits += bit;
            if (decodedBits in treeCodes) // если накопленная битовая строка является кодом какого-либо символа в дереве Хаффмана
            {
                let char = treeCodes[decodedBits]; // определение символа, соответствующего коду
                if (char === "╬") // если достигнут конец закодированной строки
                {
                    break;
                }
                decodedChars += char;
                decodedBits = ""; // очистка накопленной битовой строки
            }
        }
    return decodedChars;
    }

    for (let j = 0; j < textInput.length; j++) 
    {
      binInput += textInput.charCodeAt(j).toString(2).padStart(16, "0");
      
    }
    console.log(binInput);
    //binInput = "тут можно поломать что-то потом"
    let decodedString = decodeHaffman(binInput, treeCodes);

    console.log(decodedString);
    fs.writeFileSync(fileOutput, decodedString);

} 
else
{
  console.error("Wrong arguments given");
  process.exit(1);
}


/* Поясняловки
utftosring
Регулярное выражение /.{1,16}/g используется для разбиения строки на части длиной от 1 до 16 символов.
Конструкция . обозначает любой символ, а {1,16} говорит о том, 
что этот символ должен повторяться от 1 до 16 раз.
 Таким образом, регулярное выражение описывает любую последовательность символов длиной от 1 до 16, включая 1 символ.
Флаг g указывает, что поиск должен быть глобальным, 
т.е. должны быть найдены все подстроки, удовлетворяющие регулярному выражению.


sortpairs пример
a равно ['c', 5] а b равно ['d', 3], 
то a[1] - b[1] равно 2, что положительное число,
поэтому a должно быть после b в отсортированном массиве.


В данном случае, итератор, возвращаемый функцией splitAndConvert, 
управляет значением переменной i в каждой итерации цикла for...of. 
Итератор возвращает следующее значение массива compressed2, и это значение записывается в i.
Ключевое слово const используется здесь, чтобы указать, что переменная i является константой,
которую нельзя переназначить внутри цикла. Таким образом, в каждой итерации 
значение i будет меняться на следующий элемент массива compressed2,
но сама переменная не может быть изменена внутри цикла.
*/