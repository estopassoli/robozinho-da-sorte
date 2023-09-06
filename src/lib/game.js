const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const calculateProbability = require('../utils/calculateProbability');

class Game {
    constructor(options) {
        const { gameUrl, qtdNums, max, maxRandomGames, userGames, playRandomGames, playBoth, gamePrice, logs } = options;
        this.sessionId = new Date().getTime()
        this.logs = logs || true;
        this.gameUrl = gameUrl;
        this.qtdNums = qtdNums;
        this.max = max;
        this.maxRandomGames = maxRandomGames;
        this.userGames = userGames;
        this.playRandomGames = playRandomGames;
        this.playBoth = playBoth;
        this.played = 0;
        this.gamePrice = gamePrice;
        this.toPlay = maxRandomGames + userGames.length;
        this.probability = calculateProbability(userGames, max, qtdNums)
        console.log(log)

    }

    async delay(seconds) {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }

    async initializeBrowser() {
        const browser = await puppeteer.launch({
            args: ['--start-maximized'],
            headless: false,
            executablePath: 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1360, height: 768 });
        return { browser, page };
    }

    async goToGamePage(page) {
        await page.goto(this.gameUrl);
        await this.delay(2);
        await page.click('#botaosim');
        await page.goto(this.gameUrl);
        await page.evaluate(() => document.body.style.zoom = 0.50);
    }

    async playUserGame(page, numbers) {

        numbers = this.replaceDuplicatesWithRandom(numbers);

        console.log('\n\n+==========================================================================+');
        console.log(`| ========================= JOGANDO RODADA ${this.played + 1}/${this.toPlay} ======================== |`);
        console.log(`| ======================= NUMEROS FORNECIDOS PELO USUÁRIO ================ |\n| ${numbers.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).join(" | ")} |\n+ ======================================================================== +`);


        for (let i = 0; i < numbers.length; i++) {
            const num = numbers[i];
            const el = `#n${num}`;
            await page.waitForSelector(el);

            process.stdout.write(`\r| ${numbers.map((n, index) => index <= i ? 'XX' : n).join(' | ')} |`);

            await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.scrollIntoView();
                    element.click();
                }
            }, el);
        }

        await page.evaluate(async () => {
            const element = document.querySelector('#colocarnocarrinho');
            if (element) {
                element.scrollIntoView();
                element.click();
            }
        });

        process.stdout.write('\n+ ======================================================================== +\n');
        process.stdout.write(`\r| ======================== RODADA ${this.played + 1}/${this.toPlay} FINALIZADA ====================== |\n`);
        process.stdout.write(`\r+ ====================== TOTAL ATÉ AGORA: R$ ${(this.played * this.gamePrice).toFixed(2)} ====================== +\n`);
        process.stdout.write('\r+ ======================================================================== +\n\n');
        this.writePlayedGames(numbers, this.sessionId)

        this.played++;
    }


    async playRandomGame(page) {
        const numbers = this.generateUniqueRandomNumbers();

        console.log('\n\n+==========================================================================+');
        console.log(`| ========================= JOGANDO RODADA ${this.played + 1}/${this.toPlay} ======================== |`);
        console.log(`| ======================= NUMEROS FORNECIDOS PELO JUNINHO ================ |\n| ${numbers.sort((a, b) => parseInt(a, 10) - parseInt(b, 10)).join(" | ")} |\n+ ======================================================================== +`);

        for (let i = 0; i < numbers.length; i++) {
            const num = numbers[i];
            const el = `#n${num}`;
            await page.waitForSelector(el);

            process.stdout.write(`\r| ${numbers.map((n, index) => index <= i ? 'XX' : n).join(' | ')} |`);

            await page.evaluate((selector) => {
                const element = document.querySelector(selector);
                if (element) {
                    element.scrollIntoView();
                    element.click();
                }
            }, el);
        }

        await page.evaluate(async () => {
            const element = document.querySelector('#colocarnocarrinho');
            if (element) {
                element.scrollIntoView();
                element.click();
            }
        });


        process.stdout.write('\n+ ======================================================================== +\n');
        process.stdout.write(`\r| ======================== RODADA ${this.played + 1}/${this.toPlay} FINALIZADA ====================== |\n`);
        process.stdout.write(`\r+ ======================== TOTAL ATÉ AGORA: R$ ${(this.played * this.gamePrice).toFixed(2)} ====================== +\n`);
        process.stdout.write('\r+ ======================================================================== +\n\n');
        this.writePlayedGames(numbers, this.sessionId);
        this.played++;
    }

    async dismissModal(page) {
        await page.evaluate(() => {
            const element = document.querySelector('#confirm-cancel > div > div > div.modal-footer > button');
            if (element) {
                element.scrollIntoView();
                element.click();
            }
        });
    }

    replaceDuplicatesWithRandom(arr) {
        let uniqueNumbers = new Set();

        for (let i = 0; i < arr.length; i++) {
            if (uniqueNumbers.has(arr[i])) {
                // Substitui o número repetido por um novo número aleatório
                let randomNum;
                do {
                    randomNum = (Math.floor(Math.random() * this.max) + 1).toString().padStart(2, '0');
                    console.log(`\n\n+ ======================================== +`)
                    console.log(`+ JOGO: ${this.played}/${this.toPlay}`)
                    console.log(`+ NUMERO DUPLICADO DETECTADO: ${arr[i]}`)
                    console.log(`+ NUMERO DUPLICADO SUBSTITUÍDO POR: ${randomNum}`)
                    console.log(`+ ======================================== +`)
                } while (uniqueNumbers.has(randomNum));

                arr[i] = randomNum;
            }
            uniqueNumbers.add(arr[i]);
        }

        return arr;
    }

    generateUniqueRandomNumbers() {
        if (this.max - 1 + 1 < this.qtdNums) {
            throw new Error("Não é possível gerar a quantidade solicitada de números únicos com o intervalo fornecido.");
        }

        const uniqueNumbersSet = new Set();

        while (uniqueNumbersSet.size < this.qtdNums) {
            const randomValue = Math.floor(Math.random() * (this.max - 1 + 1) + 1);
            uniqueNumbersSet.add(String(randomValue).padStart(2, '0'));
        }

        return [...uniqueNumbersSet];
    }

    logHeader() {
        console.log(`\n\n+ ======================================================== +`);
        console.log(`+ INICIANDO PROCESSO DE APOSTAS AUTOMÁTICAS`);
        console.log(`+ TOTAL DE JOGOS: ${this.toPlay}`);
        console.log(`+ JOGOS FEITOS PELOS USUÁRIOS TÊM ${this.probability} DE SER SORTEADO`);
        console.log(`+ PREÇO DE CADA APOSTA: R$ ${this.gamePrice.toFixed(2)} `);
        console.log(`+ PREÇO TOTAL: R$ ${(this.toPlay * this.gamePrice).toFixed(2)} `);
        console.log(`+ STATUS: INICIANDO ROBÔ`);
        console.log(`+ ======================================================== +`);
    }

    logFooter() {
        console.log(`\n\n+ ======================================================== +`);
        console.log(`+ PROCESSO FINALIZADO TOTAL DE JOGADAS: ${this.toPlay}`);
        console.log(`+ ERROS: 0/${this.toPlay}`);
        console.log(`+ SUCESSO: ${this.played}/${this.toPlay}`);
        console.log(`+ PREÇO TOTAL: R$ ${(this.toPlay * this.gamePrice).toFixed(2)}`);
        console.log(`+ STATUS: AGUARDANDO PAGAMENTO`);
        console.log(`+ ======================================================== +`);
    }

    async play() {
        console.log(`Iniciando sessão de apostas ${this.sessionId}`);
        const { browser, page } = await this.initializeBrowser();
        await this.goToGamePage(page);

        this.logHeader();

        while (this.played < this.toPlay) {
            await this.delay(1);
            await this.dismissModal(page);

            if (this.userGames.length > 0) {
                await this.playUserGame(page, this.userGames.shift());
            } else if (this.playRandomGames) {
                await this.playRandomGame(page);
            }
        }

        this.logFooter();
    }

    async writePlayedGames(log, id) {
        if (!this.logs) return;
        const filepath = path.resolve(__dirname, `../logs/${id}.csv`);
        try {
            const file = fs.readFileSync(filepath, 'utf-8');
            if (file) return fs.appendFileSync(filepath, log.join(',') + '\n');
        } catch (err) {
            fs.writeFileSync(filepath, log.join(',') + '\n')
        }
    }
}

module.exports = Game;
