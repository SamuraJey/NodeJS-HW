let fs = require('fs');

//функция, принимающая параметры из командной строки


function bruteForce(string, substring){
    let occurrences = new Array;
    let i = 0;

    len_str = string.length;
    len_substr = substring.length;

    while (i <= len_str - len_substr){
        let j = 0;
        while (substring[j] == string[i + j]){
            j++;
            if (j == len_substr){
                occurrences.push(i);
                break;
            }
        }
        i++;
    }

    return occurrences;
}

function hash(string, substring){
    let occurrences = new Array();
    let hash_substr = 0;
    let hash_str = 0;

    len_str = string.length;
    len_substr = substring.length;

    for (i = 0; i < len_substr; i++){
        hash_substr += substring.charCodeAt(i) * Math.pow(2, len_substr - i - 1);
        hash_str += string.charCodeAt(i) * Math.pow(2, len_substr - i - 1);
    }
    
    for (i = 0; i < len_str - len_substr + 1; i++){
        if (hash_str == hash_substr){
            let j = 0;
            while (substring[j] == string[i + j]){
                j++;
                if (j == len_substr){
                    occurrences.push(i);
                    break;
                }
            }
        }

        hash_str = (hash_str - string.charCodeAt(i) * Math.pow(2, len_substr - 1)) * 2 + string.charCodeAt(i + len_substr);
    }

    return occurrences;
}

//функция, осуществляющая связь между чтением и записью файла и работы алгоритмов поиска
function findSubstr(inputPath, outputPath, substring, algorithm) {
    fs.readFile(inputPath, (err, data) => {
        if (err) {
            if (err.code == 'ENOENT') {
                console.error('Error! The path ' + inputPath + ' does not exist');
                process.exit(-1);
            }
            if (err.code == 'EISDIR') {
                console.error('Error! Path to file expected (the path to the directory is specified)');
                process.exit(-1);
            }
            if (err.code == 'EACCES') {
                console.error('Error! Access is denied to the file ' + inputPath);
                process.exit(-1);
            }
        }

        string = data.toString();
        let occurrences;

        if (algorithm == "brute") {
           timeAtStart = new Date();
           occurrences = bruteForce(string, substring);
           timeAtEnd = new Date();
           console.log('Time for Brute Force:', timeAtEnd - timeAtStart, 'ms')
        }

        else if (algorithm == "hash") {
           timeAtStart = new Date();
           occurrences = hash(string, substring);
           timeAtEnd = new Date();
           console.log('Time for Hash:', timeAtEnd - timeAtStart, 'ms')
        }

        else {
            console.error('Error! Unknown algorithm');
            process.exit(-1);
        }

        let index = "";
        for (i = 0; i < occurrences.length; i++)
            index += occurrences[i] + '\n';

        fs.writeFile(outputPath, index, (err) => {
            if (err) {
                if (err.code == 'EACCES')
                    console.error('Error! Access is denied to the file ' + outputPath);
                process.exit(-1);
            }
        });
    })
}

function main(){
    //let params = getParameters();
    //inputPath = params[0];
    let inputPath = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/warandpeace.txt";
    //outputPath = params[1];
    let outputPath = "C:/Users/SamuraJ/Documents/GitHub/NodeJS-HW/Find substring in string/output.txt";
    //substring = params[2];
    let substring = "Андрей Болконский"
    //algorithm = params[3];
     let algorithm = "hash";
    findSubstr(inputPath, outputPath, substring, algorithm);
}

main()