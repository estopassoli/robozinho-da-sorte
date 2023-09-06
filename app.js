const readline = require('readline');
const Game = require("./src/lib/game");
const playFromCsv = require("./src/utils/playFromCsv");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let userInputs = {};

const questions = [
    {
        name: 'gameUrl',
        question: 'Informe a URL do jogo: '
    },
    {
        name: 'qtdNums',
        question: 'Informe a quantidade de números por aposta randômica: ',
        type: 'number'
    },
    {
        name: 'max',
        question: 'Informe o número máximo considerado apostável: ',
        type: 'number'
    },
    {
        name: 'maxRandomGames',
        question: 'Informe a quantidade de jogos aleatórios: ',
        type: 'number'
    },
    {
        name: 'playRandomGames',
        question: 'Deseja jogar números aleatórios? (s/n): ',
        type: 'boolean'
    },
    {
        name: 'playBoth',
        question: 'Deseja jogar ambos (números do usuário e aleatórios)? (s/n): ',
        type: 'boolean'
    },
    {
        name: 'logs',
        question: 'Deseja efetuar log de todas as apostas feitas? (s/n): ',
        type: 'boolean'
    },
    {
        name: 'gamePrice',
        question: 'Informe o preço de cada jogo: ',
        type: 'number'
    }
];

function askQuestion(index) {
    if (index < questions.length) {
        rl.question(questions[index].question, (answer) => {
            // Convertendo o input para o tipo correto, se necessário.
            switch (questions[index].type) {
                case 'number':
                    userInputs[questions[index].name] = parseInt(answer, 10);
                    break;
                case 'boolean':
                    userInputs[questions[index].name] = answer.toLowerCase() === 's';
                    break;
                default:
                    userInputs[questions[index].name] = answer;
            }
            askQuestion(index + 1);
        });
    } else {
        console.log(userInputs)

        // Aqui, todas as perguntas foram feitas e temos todas as respostas.
        userInputs.userGames = playFromCsv();

        const game = new Game(userInputs);
        game.play();

        rl.close();
    }
}

// Iniciar fazendo a primeira pergunta
askQuestion(0);
