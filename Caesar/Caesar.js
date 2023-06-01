const fs = require('fs');

const [mode, inputFile, pass, inputShift] = process.argv.slice(2);
const CODE_OF_a = 'a'.charCodeAt(0);

function encrypt(message, shift)
{
    let encrypted = ''; // строка, которую будем возвращать
    shift = Math.abs(shift) % 26; // сдвиг по модулю 26
    // проходимся по всем символам сообщения
    for (let symbol of message)
    {
        let lowercaseSymbol = symbol.toLowerCase(); // переводим символ в нижний регистр
        // если символ не из английского алфавита, то добавляем его в итоговую строку и переходим к следующему символу
        if (lowercaseSymbol < 'a' || lowercaseSymbol > 'z')
        {
            encrypted += symbol;
            continue;
        }
        let shiftAdd = (lowercaseSymbol > symbol) ? 'A'.charCodeAt(0) - CODE_OF_a : 0; // если символ в верхнем регистре, то добавляем разницу кодов 'A' и 'a', иначе 0
        // таким образом мы получаем код символа в верхнем регистре, если он изначально был в верхнем регистре, если был в нижнем то shiftAdd = 0
        let codeOfCurrentSymbol = CODE_OF_a + shiftAdd + (lowercaseSymbol.charCodeAt(0) - CODE_OF_a + shift) % 26; // получаем код символа после сдвига
        encrypted += String.fromCharCode(codeOfCurrentSymbol);
    }

    return encrypted;
}

function getAlphabetFrequency(alphabetFile)
{
    let alphabetFrequency = {}; // объект, в котором будем хранить частотность букв
    let alphabet = fs.readFileSync(alphabetFile, 'utf8').split('\r\n'); // считываем алфавит из файла, разбивая пр переносам строк
    for (let entry of alphabet)
    {
        let [letter, frequency] = entry.split(' '); // разбиваем строку на букву и частотность
        alphabetFrequency[letter] = parseFloat(frequency); // добавляем в объект
    }
    return alphabetFrequency;
}

function getCipherFrequency(encryptedText) // функция, которая считает частотность букв в зашифрованном тексте
{
    let encryptedFrequency = {};
    let count = 0;
    for (let i = 0; i < 26; i++) // инициализируем объект частотности нулями
    {
        encryptedFrequency[String.fromCharCode(CODE_OF_a + i)] = 0;
    }

    for (let symbol of encryptedText) // считаем частотность букв
    {
        let lowercaseSymbol = symbol.toLowerCase();
        if (lowercaseSymbol < 'a' || lowercaseSymbol > 'z')
        {
            continue;
        }
        encryptedFrequency[lowercaseSymbol]++;
        count++;
    }

    for (let i = 0; i < 26; i++) // делим на общее количество букв, чтобы получить частотность
    {
        let letter = String.fromCharCode(CODE_OF_a + i);
        encryptedFrequency[letter] = (encryptedFrequency[letter] / count) * 100;
    }

    return encryptedFrequency;
}

// функция, которая считает сумму квадратов разницы частотностей букв в алфавите и зашифрованном тексте
function getDifference(alphabetFrequency, encryptedFrequency, shift)
{
    let sum = 0;
    for (let i = 0; i < 26; i++)
    {
        // получаем букву по коду, к "а" прибавляем i, чтобы получить букву "а", "b", "c" и т.д.
        const letter = String.fromCharCode(CODE_OF_a + i);
        // получаем разницу частотности буквы в алфавите и в зашифрованном тексте
        const diff = alphabetFrequency[letter] - encryptedFrequency[String.fromCharCode(CODE_OF_a + (i + shift) % 26)];
        sum += Math.abs(diff);
        //sum += Math.pow(diff, 2);
    }
    return sum;
}

// функция, которая определяет сдвиг шифра
function determineShift(alphabetFrequency, encryptedFrequency) 
{
    let shift = 0;
    // считаем разницу частотностей при сдвиге 0
    let minDifference = getDifference(alphabetFrequency, encryptedFrequency, 0);
    // считаем разницу частотностей при сдвиге 1
    let currentDifference = getDifference(alphabetFrequency, encryptedFrequency, 1);
    // считаем разницу частотностей при сдвиге от 2 до 25
    for (let i = 2; i < 26; i++) 
    {
        currentDifference = getDifference(alphabetFrequency, encryptedFrequency, i);
        // если разница меньше, чем минимальная разница, то обновляем минимальную разницу и предпологаемый сдвиг
        if (currentDifference < minDifference) 
        {
            minDifference = currentDifference;
            shift = i;
        }
    }
    return shift;
}

// функция, которая расшифровывает текст
function decrypt(encryptedMessage, shift)
{
    let decryptedMessage = ''; // строка, которую будем возвращать
    for (let symbol of encryptedMessage) // проходимся по всем символам сообщения
    {
        let lowercaseSymbol = symbol.toLowerCase(); // переводим символ в нижний регистр
        // если символ не из английского алфавита, то добавляем его в итоговую строку и переходим к следующему символу
        if (lowercaseSymbol < 'a' || lowercaseSymbol > 'z') 
        {
            decryptedMessage += symbol;
            continue;
        }
        // если символ в верхнем регистре, то разница кодов 'A' и 'a' (равную -32), иначе 0, для восстановления регистра
        let shiftAdd = (lowercaseSymbol > symbol) ? 'A'.charCodeAt(0) - CODE_OF_a : 0;
        // получаем код символа после сдвига
        let codeOfCurrentSymbol = CODE_OF_a + shiftAdd + (lowercaseSymbol.charCodeAt(0) - CODE_OF_a + (26 - shift)) % 26;
        decryptedMessage += String.fromCharCode(codeOfCurrentSymbol);
    }
    return decryptedMessage;
}

// основная функция, в которой обрабатывается ввденные аргументы
function main()
{
    switch (mode)
    {
        case '-e':
            let shift;
            // если не задан сдвиг, то генерируем случайный
            if (!pass || !inputShift) 
            {
                shift = Math.floor(Math.random() * 26);
            }
            else
            {
                shift = Number(inputShift);
            }
            let input = fs.readFileSync(inputFile, 'utf8');
            let encryptedMessage = encrypt(input, shift);
            console.log(encryptedMessage);
            break;

        case '-d':
            let input1 = fs.readFileSync(inputFile, 'utf8');
            let alphabetFrequency = getAlphabetFrequency("alphabet.txt");
            let cipherFrequency = getCipherFrequency(input1);
            let recoveredShift = determineShift(alphabetFrequency, cipherFrequency);
            let decryptedMessage = decrypt(input1, recoveredShift);

            console.log(`Shift: ${recoveredShift}`);
            console.log(`Deciphered message:\n${decryptedMessage}`);
            break;
        case '-h':
            console.log('Usage: Caesar3.js [mode] [input file] [-s] [shift]');
            console.log('[-s] и [shift] - опциональные аргументы, если не указан сдвиг, будет сгенерирован случайный');
            console.log('Режимы:');
            console.log('-e - encrypt');
            console.log('-d - decrypt');
            console.log('-h - help');
            break;

        default:
            console.log('Неправльный режим, используйте -h для справки');
            break;
    }

}

main();

return 0;



/*
old code from main()

    //let cipher_buff = fs.readFileSync('input.txt')
    // let input = fs.readFileSync('input.txt', 'utf8');

    // let shift = Number(inputShift);

    // let cipher = encrypt(input, shift);

    // console.log(`Cipher:\n${cipher}`);

    // let alphabet_frequency = getAlphabetFrequency("alphabet.txt");

    // let cipher_frequency = getCipherFrequency(cipher);

    // let resoret_shift = determineShift(alphabet_frequency, cipher_frequency);

    // console.log(`Shift: ${resoret_shift}`);

    // let decipheredMessage = decrypt(cipher, resoret_shift);

    // console.log(`Deciphered message:\n${decipheredMessage}`);

*/

// for (let i = 0; i < 26; i++)
// {
//     let input = fs.readFileSync("input.txt", 'utf8');
//     let cipher = encrypt(input, i);
//     console.log(`Cipher:\n${cipher}`);
// }

// need to write function that will generate random text with given alphabet and length

// function generateRandomText(alphabet, length) {
//     let text = '';
//     for (let i = 0; i < length; i++) {
//         text += alphabet[Math.floor(Math.random() * alphabet.length)];
//     }
//     return text;
// }
// console.log(generateRandomText('abcdefghijklmnopqrstuvwxyz', 100));

// function randomWords(alphabet, length) {
//     const words = []
//     while (length > 0) {
//       const char = getRandomChar(alphabet)
//       words.push(char)
//       length--
//     }
//     function getRandomChar(alphabet) {
//         // Сумма всех частотностей
//         let totalFrequency = 0;
//         for (let [char, frequency] of Object.entries(alphabet)) {
//           totalFrequency += Number(frequency);
//         }

//         // Выбираем случайную частотность 0 - totalFrequency
//         let randomFrequency = Math.floor(Math.random() * totalFrequency);

//         // Находим соответствующий символ
//         for (let [char, frequency] of Object.entries(alphabet)) {
//           randomFrequency -= Number(frequency);
//           if (randomFrequency <= 0) return char;
//         }
//       }
//     return words.join('')
//   }

// function testEncryptDecrypt(numOfTests)
// {
//     let alphabet = getAlphabetFrequency('Ceasar/alphabet.txt');
//     let alphabetKeys = Object.keys(alphabet);
//     let alphabetValues = Object.values(alphabet);
//     for (let i = 0; i < numOfTests; i++) {
//         let word = generateRandomText(alphabetKeys, 100)
//         let shift = Math.floor(Math.random() * 26);
//         let encryptedMessage = encrypt(word, shift);
//         let foundShift = determineShift(alphabet, getCipherFrequency(encryptedMessage));
//         let decryptedMessage = decrypt(encryptedMessage, foundShift, getCipherFrequency(encryptedMessage));
//         if (word !== decryptedMessage)
//         {
//             console.log(`ERROR!!! Test failed: ${word} !== ${decryptedMessage}`);
//             return 1;
//         }
//         else
//         {
//             console.log(`Test passed:\noriginal - ${word}\nrecovere - ${decryptedMessage}`);
//         }
//     }
//     console.log(`All ${numOfTests} tests passed`);
// }

// testEncryptDecrypt(100);
