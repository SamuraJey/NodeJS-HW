const fs = require('fs');
const [mode, inputFilename, outputFilename] = process.argv.slice(2);

function FileExist(inpFile)
{
    if ((fs.existsSync(inpFile))) // Проверяем, существует ли входной файл
        return true;
    else return false;
}

function codeRle(inputText)
{
    let outputText = '';
    for (let i = 0; i < inputText.length;)
    {
        let sequenceLength = 1;
        // Находим длину повторяющейся последовательности символов
        for (let j = i + 1; j < inputText.length && inputText[j] === inputText[i]; j++)
        {
            sequenceLength++;
        }
        if (inputText[i] === '#') // Если символ #, то кодируем его как специальный символ
        {
            let encodedSpecSequence = `#${String.fromCharCode(sequenceLength)}#`;
            outputText += encodedSpecSequence;
            i += sequenceLength;
        }
        else
        {
            if (sequenceLength >= 4) // Если последовательность длиннее или равна 4 символам, кодируем ее
            {
                let encodedSequence = `#${String.fromCharCode(sequenceLength - 4)}${inputText[i]}`;
                if (sequenceLength > 65534) // Если длина последовательности больше 65534 символов, разбиваем ее на блоки
                {
                    let remainingLength = sequenceLength - 65532;
                    while (remainingLength > 0)
                    {
                        let chunkLength = Math.min(remainingLength, 65532);
                        encodedSequence += `#${String.fromCharCode(65532)}${inputText[i]}`;
                        remainingLength -= chunkLength;
                    }
                }
                outputText += encodedSequence;
            }
            else // Если последовательность короче 4 символов, записываем ее без изменений
            {
                outputText += inputText[i].repeat(sequenceLength);
            }
            if (inputText[i] !== '#') // Если символ #, то кодируем его как специальный символ
            {
                i += sequenceLength;
            }
            else
            {
                i += 0;
            }
        }
    }
    return outputText;
}

function decodeRle(inputText)
{
    let outputText = '';
    for (let i = 0; i < inputText.length;)
    {
        if (inputText[i] === '#')
        {
            if (inputText[i + 2] === '#')
            {
                let sequenceLength = inputText.charCodeAt(i + 1);
                let sequenceChar = inputText[i + 2];
                outputText += sequenceChar.repeat(sequenceLength);
                i += 3;
                continue;
            }
            let sequenceLength = inputText.charCodeAt(i + 1) + 4;
            let sequenceChar = inputText[i + 2];
            outputText += sequenceChar.repeat(sequenceLength);
            i += 3;
        }
        else
        {
            outputText += inputText[i];
            i += 1;
        }
    }
    return outputText;
}
if (mode.toLowerCase() === 'code')
{
    if (!(FileExist(inputFilename)))
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }

    const inputText = fs.readFileSync(inputFilename, 'utf8'); // Считываем содержимое входного файла
    let outputText = '';

    outputText = codeRle(inputText);
    fs.writeFileSync(outputFilename, outputText, 'utf8'); // Записываем сжатые данные в выходной файл 
    const inputFileSize = fs.statSync(inputFilename).size;
    const outputFileSize = fs.statSync(outputFilename).size;

    console.log(`Файл сжат. Коэфицент сжатия: ${inputFileSize / outputFileSize}`); // Выводим соотношение размеров входного и выходного файлов
}
else if (mode.toLowerCase() === 'decode')
{
    if (!(FileExist(inputFilename)))
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }
    
    const inputText = fs.readFileSync(inputFilename, 'utf8'); // Считываем содержимое входного файла
    let outputText = '';
    outputText = decodeRle(inputText);
    fs.writeFileSync(outputFilename, outputText, 'utf8');
}
else
{
    console.log('Ошибка: неверно указан режим работы');
}