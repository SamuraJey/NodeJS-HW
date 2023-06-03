const fs = require('fs');

const [mode, inputFilename, outputFilename] = process.argv.slice(2); // Получаем аргументы командной строки
var remainingLength = 0;
var chunkLength = 0;
function compressRLE(input)
{
    let compressed = ''; // Строка, в которую будет записан результат сжатия
    let count = 1; // Количество повторений символа
    let isReshetka = false; // Флаг, указывающий на то, что d последовательности есть решетки

    for (let i = 0; i < input.length; i++) // Проходим по всем символам входной строки
    {
        if (input[i] === '#') // Если текущий символ - решетка, то устанавливаем флаг
        {
            isReshetka = true;
        }
        if (input[i] === input[i + 1]) // Если текущий символ равен следующему, то увеличиваем счетчик
        {
            count++;
        }
        else // Иначе записываем результат сжатия в строку и сбрасываем счетчик
        {
            if (isReshetka) // Если последовательность содержит решетки, то записываем в сжатую строку в виде #<количество>#
            {
                if (count > 32001) // Если количество символов больше 32001, то разбиваем на части по 32000 символов
                {
                    remainingLength = count - 32000;
                    //console.log(remainingLength);
                    while (remainingLength > 0)
                    {
                        chunkLength = Math.min(remainingLength, 32000);
                        compressed += `#${String.fromCharCode(32000)}#`; // Записываем в сжатую строку в виде #<32000>#
                        remainingLength -= chunkLength;
                        console.log(chunkLength);
                    }
                }
                //console.log(remainingLength);
                if (chunkLength > 0)
                {
                    compressed += `#${String.fromCharCode(chunkLength)}#`;

                    isReshetka = false;
                }
                isReshetka = false;
            }
            else
            {
                if (count >= 4)
                {
                    if (count > 32001)
                    {
                        remainingLength = count - 32000;
                        while (remainingLength > 0)
                        {
                            let chunkLength = Math.min(remainingLength, 32000);
                            compressed += `#${String.fromCharCode(32000)}${inputText[i]}`;
                            remainingLength -= chunkLength;
                        }
                    }
                    compressed += `#${String.fromCharCode(count)}${inputText[i]}`;
                }
                else
                {
                    compressed += input[i].repeat(count);
                }
            }
            count = 1;
        }
    }
    return compressed;
}

function decompressRLE(input)
{
    let decompressed = '';

    for (let i = 0; i < input.length; i++)
    {
        const currentChar = input[i];

        if (currentChar === '#' && i + 1 < input.length)
        {
            let idx = i + 1;


            const howMany = input.charCodeAt(idx);
            const char = input[idx + 1];

            if (char !== undefined)
            {
                decompressed += char.repeat(howMany);
            }
            else
            {
                decompressed += '#';
            }

            i = idx;
            intStr = '';
        }
        else
        {
            decompressed += currentChar;
        }
    }

    return decompressed;
}

if (mode.toLowerCase() === '-e')
{
    if (!((fs.existsSync(inputFilename))))
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }
    const inputText = fs.readFileSync(inputFilename, 'utf8'); // Считываем содержимое входного файла
    const compressedOutput = compressRLE(inputText);
    fs.writeFileSync(outputFilename, compressedOutput, 'utf8'); // Записываем сжатые данные в выходной файл 
    const inputFileSize = fs.statSync(inputFilename).size;
    const outputFileSize = fs.statSync(outputFilename).size;
    console.log(`Файл сжат. Коэфицент сжатия: ${inputFileSize / outputFileSize}`);
    return;
}
else if (mode.toLowerCase() === '-d')
{
    if (!((fs.existsSync(inputFilename))))
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }
    const inputText = fs.readFileSync(inputFilename, 'utf8'); // Считываем содержимое входного файла
    const decompressedOutput = decompressRLE(inputText);
    fs.writeFileSync(outputFilename, decompressedOutput, 'utf8'); // Записываем разсжатые данные в выходной файл
    return;
}
else if (mode.toLowerCase() === '-t')
{

    if (!((fs.existsSync(inputFilename))))
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }
    if (!((fs.existsSync(outputFilename))))
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }

    const inputText1 = fs.readFileSync(inputFilename, 'utf8');
    const inputText2 = fs.readFileSync(outputFilename, 'utf8');
    if (inputText1 === inputText2)
    {
        console.log("ok");
    }
    else
    {
        console.log("not ok");
    }
    return;
}


// Пример использования
// const input = 'AAAA##B#';
// let compressedOutput = compressRLE(input);
// compressedOutput = "#10A#2B#2#"
// console.log(compressedOutput); // Выводит: #4A#2#B#1# #4A#2#B#1#
// decompressRLE(compressedOutput);

