class Caesar {
    constructor() {
        this.alphabetFrequency = this.getAlphabetFrequency();
    }

    getAlphabetFrequency() {
        let alphabetFrequency = {};
        let alphabet = fs.readFileSync('Ceasar/alphabet.txt', 'utf8').split('\r\n');
        for (let i = 0; i < alphabet.length; i++) {
            let letter = alphabet[i].split(' ')[0];
            let frequency = alphabet[i].split(' ')[1];
            alphabetFrequency[letter] = parseFloat(frequency);
        }
        return alphabetFrequency;
    }

    getCipherFrequency(cipher) {
        let cipherFrequency = {};
        for (let i = 0; i < 26; i++) {
            cipherFrequency[String.fromCharCode('a'.charCodeAt(0) + i)] = 0;
        }
        let count = 0;
        for (let i = 0; i < cipher.length; i++) {
            let symbol = cipher[i].toLowerCase();
            if (symbol.charCodeAt(0) < 'a'.charCodeAt(0) || symbol.charCodeAt(0) > 'z'.charCodeAt(0)) {
                continue;
            }
            cipherFrequency[symbol]++;
            count++;
        }

        for (let i = 0; i < 26; i++) {
            cipherFrequency[String.fromCharCode('a'.charCodeAt(0) + i)] =
                cipherFrequency[String.fromCharCode('a'.charCodeAt(0) + i)]
                / count
                * 100;
        }

        return cipherFrequency;
    }

    getDifference(alphabetFrequency, cipherFrequency, shift) {
        let sum = 0;
        for (let i = 0; i < 26; i++) {
            sum += Math.pow(alphabetFrequency[String.fromCharCode('a'.charCodeAt(0) + i)] -
            cipherFrequency[String.fromCharCode('a'.charCodeAt(0) + (i + shift) % 26)], 2);
        }
        return sum;
    }

    determineShift(cipher) {
        let cipherFrequency = this.getCipherFrequency(cipher);
        let shift = 0;
        let minDiff = this.getDifference(this.alphabetFrequency, cipherFrequency, 0);
        for (let i = 1; i < 26; i++) {
            let currDiff = this.getDifference(this.alphabetFrequency, cipherFrequency, i);
            if (currDiff < minDiff) {
                minDiff = currDiff;
                shift = i;
            }
        }

        return shift;
    }

    decipher(cipher, shift) {
        let decipher = '';
        for (let i = 0; i < cipher.length; i++) {
            let symbol = cipher[i].toLowerCase();
            if (symbol.charCodeAt(0)< 'a'.charCodeAt(0) || symbol.charCodeAt(0) > 'z'.charCodeAt(0)) {
                decipher += symbol;
                continue;
            }
            let shiftAdd = 0;
            if (symbol.charCodeAt(0) > cipher[i].charCodeAt(0)) {
                shiftAdd = 'A'.charCodeAt(0) - 'a'.charCodeAt(0);
            }
            let codeOfCurrentSymbol = 'a'.charCodeAt(0)
                + shiftAdd
                + (symbol.charCodeAt(0) - 'a'.charCodeAt(0) + (26 - shift)) % 26;
            decipher += String.fromCharCode(codeOfCurrentSymbol);
        }
        return decipher;
    }
    encrypt(message, shift) {
        let cipher = '';
        for (let i = 0; i < message.length; i++) {
            let symbol = message[i].toLowerCase();
            if (symbol.charCodeAt(0) < 'a'.charCodeAt(0) || symbol.charCodeAt(0) > 'z'.charCodeAt(0)) {
                cipher += symbol;
                continue;
            }
            let shiftAdd = 0;
            if (symbol.charCodeAt(0) > message[i].charCodeAt(0)) {
                shiftAdd = 'A'.charCodeAt(0) - 'a'.charCodeAt(0);
            }
            let codeOfCurrentSymbol = 'a'.charCodeAt(0)
                + shiftAdd
                + (symbol.charCodeAt(0) - 'a'.charCodeAt(0) + shift) % 26;
            cipher += String.fromCharCode(codeOfCurrentSymbol);
        }

        return cipher;
    }
}

const caesar = new Caesar();
const plaintext = 'hello world';
const shift = 3;
const cipher = caesar.encrypt(plaintext, shift);
console.log(cipher); // 'khoor zruog'