const { log, error } = require("console");
const fs = require("fs");
const arg = process.argv;

const [mode,fileInput, fileOutput, fileHelp, fileFreq] = process.argv.slice(2);

if (mode.toLowerCase() == "help") 
{
    console.log("This is a program that performs encoding and decoding of text files using Huffman coding algorithm. It stores output values in unicode symbols");
    console.log("Usage:");
    console.log("For encoding:");
    console.log("node app.js code <inputfile.txt> <outputFile.txt> <outputTree.json>");
    console.log("For decoding:");
    console.log("node app.js decode <inputFile.txt> <inputTree.json> <outputFile.txt>");
    console.log();
    console.log("Note: The symbol '╬' is reserved and cannot be used in the input text file, as it is used as an end-of-file marker.");
    console.log("Example usage for encoding: node app.js code input.txt output.txt tree.json");
    console.log("Example usage for decoding: node app.js decode output.txt tree.json output_decoded.txt");
    console.log();
    process.exit(0);
}

let bolt = "╬";

class HuffmanNode //Класс для узлов дерева Хаффмана
{
    constructor(symbol, freq, left = null, right = null) //Конструктор класса
    {
        this.symbol = symbol; 
        this.freq = freq;
        this.left = left; //Левый потомок
        this.right = right; //Правый потомок
    }
}

function splitAndConvert(str) //Функция которая разделяет бинарную последовательность на части по 16, добивает нулями если <16, и конверитрует в символ юникода.
{
    // Дополнить строку нулями до кратности 8
    while (str.length % 8 !== 0) 
    {
        str += 0;
    }
  // Разбить строку на части по 8 символов
  const chunks = str.match(/.{1,8}/g);

  // Преобразовать каждую часть в десятичное число и потом в массив строк (состоящих из 1 стмвола) UTF-16
const utf16Strings = chunks.map(chunk => {
    const decimal = parseInt(chunk, 2);
    return String.fromCharCode(decimal);});
  // Склеить все строки символов UTF-16 в одну строку и вернуть её
  return utf16Strings.join('');
}

function findFrequencies(str)
{
    const freq = {};
    for (let i = 0; i < str.length; i++)
    {
      const char = str[i];
      if (!freq[char])
      {
        freq[char] = 1;
      } 
      else 
      {
        freq[char]++;
      }
    }
  
    const len = str.length;
    for (let char in freq) {
        freq[char] /= len;
    }
    const nodes = [];
    for (let char in freq) {
        nodes.push(new HuffmanNode(char, freq[char], null, null));
    }
    return nodes;
}

function buildHuffmanTree(nodes) 
{
    while (nodes.length > 1)
    {
        nodes.sort((a, b) => a.freq - b.freq);
        const left = nodes.shift();
        const right = nodes.shift();
        const parent = new HuffmanNode(null, left.freq + right.freq, left, right);
        nodes.push(parent);
    }
    return nodes[0];
}
  
  function printHuffmanTree(huffmanNode, prefix = "") //Функция для печати дерева Хаффмана
  {
    if (!huffmanNode) 
    {
        return;
    }
  
    if (huffmanNode.symbol)
    {
        console.log(`${prefix}${huffmanNode.symbol}: ${huffmanNode.freq}`);
    } 
    else 
    {
        console.log(`${prefix}Node: ${huffmanNode.freq}`);
    }
    printHuffmanTree(huffmanNode.left, prefix + "| ");
    printHuffmanTree(huffmanNode.right, prefix + "| ");
    }
  
function getHuffmanCodes(node, prefix = "")
{
    if (!node) // Если узел пустой, то возвращаем пустой объект
    {
        return {};
    }
    const codes = {};
    if (node.symbol) // Если узел - лист, то добавляем его код в объект
    {
        codes[node.symbol] = prefix; // Добавляем код символа в объект
    } 
    else 
    {
        Object.assign( // Если узел не лист, то добавляем коды левого и правого поддеревьев
            codes,
            getHuffmanCodes(node.left, prefix + "1"), // Рекурсивно вызываем функцию для левого поддерева
            getHuffmanCodes(node.right, prefix + "0") // Рекурсивно вызываем функцию для правого поддерева
        );
    }
    return codes; // Возвращаем объект с кодами символов
}

    // Функция декодирует битовую строку с использованием дерева Хаффмана,
    // которое представлено в виде объекта treeCodes с кодами символов
    function decodeHuffman(encodedString, codeTable) 
    {
        let decodedString = ''; // Результирующая строка
        let currentCode = ''; // Текущий код символа
        for (let i = 0; i < encodedString.length; i++) // Проходим по всей строке
        {
          currentCode += encodedString[i]; // Добавляем очередной бит к текущему коду
          for (let char in codeTable) // Проверяем, есть ли такой код в таблице
          {
            if (codeTable[char] === currentCode) // Если есть, то добавляем символ к результату
            {
                if (codeTable[char] === codeTable[bolt]) // Если символ болта конца файла, то выходим из цикла
                {
                    break;
                }
                decodedString += char; // Добавляем символ к результату
                currentCode = ''; // Сбрасываем текущий код
                break;
            }
          }
        }
        return decodedString;
      }

if (mode == "-e") 
{
    let textInput = fs.readFileSync(fileInput, "utf-8"); //Читаем файл
    textInput += bolt; //Добавляем символ болта конца файла

    const freq = findFrequencies(textInput); //Считаем частоту символов
    const tree = buildHuffmanTree(freq); //Строим дерево Хаффмана
    const codeTable = getHuffmanCodes(tree); //Получаем таблицу кодов символов

    //printHuffmanTree(tree); //Выводим дерево Хаффмана

    let treeCodes = {};
    var compressed2 = "";
    treeCodes = codeTable;
    for (i of textInput) //Кодируем текст
    {
        compressed2 += treeCodes[i];
    }
    console.log(compressed2);
    fs.writeFileSync(fileOutput, compressed2);
    /*
    fs.writeFileSync(fileOutput, "");
    for (const i of splitAndConvert(compressed2)) //Записываем в файл закодированный в юникод текст
    {
        fs.appendFileSync(fileOutput, i);
    }
    */
    const nodes = findFrequencies(textInput);
    const data = JSON.stringify(nodes, (key, value) => { if (key === "left" || key === "right") { return undefined;} return value;}, 2); 
    fs.writeFileSync(fileFreq, data); //Записываем в файл частоты символов
    fs.writeFileSync(fileHelp, JSON.stringify(codeTable), "utf-8"); //Записываем в файл таблицу кодов символов
    console.log("Файл успешно закодирован");
    console.log("Файл с закодированной в юникоде строкой:", fileOutput);
    console.log("Файл с кодами символов:", fileHelp);
    console.log("Файл с частотами символов:", fileFreq);
}
else if (mode == "-d")
{
    const [, , mode, fileInput, fileHelp, fileOutput] = process.argv;
    
    let textInput = fs.readFileSync(fileInput, "utf-8"); //Читаем файл
    let treeCodes = JSON.parse(fs.readFileSync(fileHelp, "utf-8")); //Читаем таблицу кодов символов
    let binInput = "";

    /*
    for (let j = 0; j < textInput.length; j++) 
    {
        binInput += textInput.charCodeAt(j).toString(2).padStart(8, "0"); //Декодируем в битовую строку
    }
    */
    //console.log("Строка в битовом виде: ", binInput);
    //binInput = "тут можно поломать что-то потом"

    
    //let decodedString = decodeHuffman(binInput, treeCodes);
    let decodedString = decodeHuffman(textInput, treeCodes)
    //console.log("Декодированная строка: ", decodedString);

    fs.writeFileSync(fileOutput, decodedString);
    console.log("Декодировали");
}
else
{
    error.log("something wrong, use help argument");
}



 
    //binInput = "тут можно поломать что-то потом"

/*
Почему-то не работает???
По идее должны быть одинаковые данныые в data и data1

const data1 = JSON.stringify(freq, (key, value) => {if (key === "left" || key === "right") {return undefined;} return value;}, 2);
console.log(data);
console.log(data1);
*/

// Тут запись файлов
