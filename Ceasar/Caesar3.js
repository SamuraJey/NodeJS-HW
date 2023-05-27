const fs = require('fs');

let [mode, inputFile, pass, inputShift] = process.argv.slice(2);

function encrypt(message, shift) {
    let encrypted = '';
    shift = Math.abs(shift) % 26;
    // console.log(`Shift: ${shift}`);
    for (let symbol of message) {
        let lowercaseSymbol = symbol.toLowerCase();
        if (lowercaseSymbol < 'a' || lowercaseSymbol > 'z') {
            encrypted += symbol;
            continue;
        }
        let shiftAdd = (lowercaseSymbol > symbol) ? 'A'.charCodeAt(0) - 'a'.charCodeAt(0) : 0;
        let codeOfCurrentSymbol = 'a'.charCodeAt(0) + shiftAdd + (lowercaseSymbol.charCodeAt(0) - 'a'.charCodeAt(0) + shift) % 26;
        encrypted += String.fromCharCode(codeOfCurrentSymbol);
    }

    return encrypted;
}

function getAlphabetFrequency(alphabetFile) {
    let alphabetFrequency = {};
    let alphabet = fs.readFileSync(alphabetFile, 'utf8').split('\r\n');
    for (let entry of alphabet) {
        let [letter, frequency] = entry.split(' ');
        alphabetFrequency[letter] = parseFloat(frequency);
    }
    return alphabetFrequency;
}

function getCipherFrequency(encryptedText) {
    let encryptedFrequency = {};
    let count = 0;
    for (let i = 0; i < 26; i++) {
        encryptedFrequency[String.fromCharCode('a'.charCodeAt(0) + i)] = 0;
    }

    for (let symbol of encryptedText) {
        let lowercaseSymbol = symbol.toLowerCase();
        if (lowercaseSymbol < 'a' || lowercaseSymbol > 'z') {
            continue;
        }
        encryptedFrequency[lowercaseSymbol]++;
        count++;
    }

    for (let i = 0; i < 26; i++) {
        let letter = String.fromCharCode('a'.charCodeAt(0) + i);
        encryptedFrequency[letter] = (encryptedFrequency[letter] / count) * 100;
    }

    return encryptedFrequency;
}

function getDifference(alphabetFrequency, encryptedFrequency, shift) {
    let sum = 0;
    for (let i = 0; i < 26; i++) {
        const letter = String.fromCharCode('a'.charCodeAt(0) + i);
        const diff = alphabetFrequency[letter] - encryptedFrequency[String.fromCharCode('a'.charCodeAt(0) + (i + shift) % 26)];
        sum += Math.pow(diff, 2);
    }
    return sum;
}

function determineShift(alphabetFrequency, encryptedFrequency) {
    let shift = 0;
    let minDifference = getDifference(alphabetFrequency, encryptedFrequency, 0);
    let currentDifference = getDifference(alphabetFrequency, encryptedFrequency, 1);
    for (let i = 2; i < 26; i++) {
        currentDifference = getDifference(alphabetFrequency, encryptedFrequency, i);
        if (currentDifference < minDifference) {
            minDifference = currentDifference;
            shift = i;
        }
    }

    return shift;
}

function decrypt(encryptedMessage, shift) {
    let decryptedMessage = '';
    for (let symbol of encryptedMessage) {
        let lowercaseSymbol = symbol.toLowerCase();
        if (lowercaseSymbol < 'a' || lowercaseSymbol > 'z') {
            decryptedMessage += symbol;
            continue;
        }
        let shiftAdd = (lowercaseSymbol > symbol) ? 'A'.charCodeAt(0) - 'a'.charCodeAt(0) : 0;
        let codeOfCurrentSymbol = 'a'.charCodeAt(0) + shiftAdd + (lowercaseSymbol.charCodeAt(0) - 'a'.charCodeAt(0) + (26 - shift)) % 26;
        decryptedMessage += String.fromCharCode(codeOfCurrentSymbol);
    }

    return decryptedMessage;
}

function main1() {
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


    switch (mode) {
        case '-e':
            let shift;
            if (!pass || !inputShift) 
                shift = Math.floor(Math.random() * 26);
            else 
                shift = Number(inputShift);
            
            let input = fs.readFileSync(inputFile, 'utf8');
            let encryptedMessage = encrypt(input, shift);
            console.log(encryptedMessage);
            break;
        case '-d':
            let input1 = fs.readFileSync(inputFile, 'utf8');
            let alphabetFrequency = getAlphabetFrequency("alphabet.txt");
            let cipherFrequency = getCipherFrequency(input1);
            let recoveredShift = determineShift(alphabetFrequency, cipherFrequency);
            console.log(`Shift: ${recoveredShift}`);
            let decryptedMessage = decrypt(input1, recoveredShift);
            console.log(`Deciphered message:\n${decryptedMessage}`);
            break;
        default:
            console.log('Wrong arguments');
            break;
    }
            
}

main1();


return 0;


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
