/*
ВСЕ ХЕРНЯ, норм ЭРЭЛЙЕ В файле GOOD_RLE.js
const fs = require('fs');

const [mode, inputFilename, outputFilename] = process.argv.slice(2);
// Получаем аргументы командной строки: режим работы, имя входного и выходного файлов

if (mode === 'code')
{
    if (!(fs.existsSync(inputFilename))) // Проверяем, существует ли входной файл
    {
        console.error("Обнаружена ошибка, файл не найден")
        process.exit(1); // Если файл не существует, выводим сообщение об ошибке и завершаем программу
    }
    const inputText = fs.readFileSync(inputFilename, 'utf8'); // Считываем содержимое входного файла
    let outputText = '';

    // Кодируем текст
    for (let i = 0; i <= inputText.length;) // проходим по каждому символу входного текста
    { 
        let length = 1; // инициализируем длину последовательности текущего символа
        while (i + length < inputText.length && inputText.charAt(i) === inputText.charAt(i + length)) 
        {
            // ищем последовательность одинаковых символов и считаем ее длину
            length++;
        }
        if (length >= 4) // если длина последовательности больше или равна 4, то кодируем ее
        { 
            outputText += `#${length}${inputText.charAt(i)}`; // добавляем закодированную последовательность в выходной текст
        } 
        else // иначе, если длина меньше 4, то добавляем последовательность не кодируя
        { 
            outputText += inputText.charAt(i).repeat(length); // добавляем последовательность в выходной текст
        }
        i += length; // переходим на следующий символ после текущей последовательности
    }

    fs.writeFileSync(outputFilename, outputText, 'utf8'); // Записываем результат в выходной файл

    // Выводим коэффициент сжатия
    const sizeInput = fs.statSync(inputFilename).size;
    const sizeCode = fs.statSync(outputFilename).size;
    console.log(`Файл сжат. Коэффициент сжатия: ${sizeInput / sizeCode}`);
} 
else if (mode === 'decode') 
{
    const inputText = fs.readFileSync(inputFilename, 'utf8'); // Считываем содержимое входного файла
    let outputText = '';
    
    // Декодируем текст
    for (let i = 0; i < inputText.length;) 
    {
        let lengthStr = '';
        while (inputText.charAt(i) === '#')
        {
            i++;
            while (/\d/.test(inputText.charAt(i))) // /\d/ - это регулярное выражение, которое соответствует любой цифре 
            { //.test проверяет выполняется ли регулярное выражение
            lengthStr += inputText.charAt(i); // считаем кол-во символов для декодирования в виде строки
            //console.log(inputText.charAt(i));
            i++;
            }
        }
      const length = parseInt(lengthStr || '1', 10); // переводим длину строки из строкового вида в числовой
      outputText += inputText.charAt(i).repeat(length); // добавляем в декодирование столько символов, сколько их должно быть
      i++;
    }
    
    fs.writeFileSync(outputFilename, outputText, 'utf8'); // Записываем результат в выходной файл
    console.log(`Файл декодирован.`);
}
else
{
    console.log('Ошибка при вводе данных'); // Если режим работы не указан корректно, выводим сообщение об ошибке
}

*/