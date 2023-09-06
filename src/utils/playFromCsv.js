const fs = require('fs');
const path = require('path');

function playFromCsv() {
    const filepath = path.resolve(__dirname, `../data/userGames.csv`);
    let file = fs.readFileSync(filepath, 'utf-8');
    file = file.split('\r\n');
    const newArray = []

    file.forEach(aposta => {
        const arr = []
        aposta = aposta.split(',');
        for (let i in aposta) {
            arr.push(String(aposta[i]).padStart(2, '0'));
        }
        newArray.push(arr)
    });

    return newArray;
}

module.exports = playFromCsv;