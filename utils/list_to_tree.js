const fs = require("fs");
const readline = require("readline");

const fr = {};

function addToDict(dict, word) {
    let d = dict;

    for (let l of word) {
        if (!d.hasOwnProperty(l)) {
            d[l] = {};
        }

        d = d[l];
    }

    d.y = 1;
}

var lineReader = readline.createInterface({
    input: fs.createReadStream("english.txt")
});

lineReader.on('line', function (line) {
    addToDict(fr, line);
});

lineReader.on('close', function (line) {
    fs.writeFileSync("english.ts", 'export const englishDictionary = \'' + JSON.stringify(fr) + '\';');
});