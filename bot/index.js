const TelegramApi = require('node-telegram-bot-api');
const options = require('./options');

const { gameOptions, againOptions } = require('./options.js');

const token = process.env.TOKEN;

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
    { command: '/start', description: 'Starting welcome' },
    { command: '/info', description: 'Get user information' },
    { command: '/game', description: 'Guess the number' },
]);

const chats = {};

async function startGame(chatId) {
    await bot.sendMessage(chatId, 'Guess the number from 0 to 9');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess', gameOptions);
}

function start() {
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(
                chatId,
                'https://tlgrm.eu/_/stickers/4dd/300/4dd300fd-0a89-3f3d-ac53-8ec93976495e/12.jpg'
            );
            return bot.sendMessage(chatId, `Welcome to Rolas Telegram Bot`);
        }

        if (text === '/info') {
            return bot.sendMessage(
                chatId,
                `Your name is ${msg.from.first_name}`
            );
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, "I don't understand you");
    });

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;

        if (data === '/again') {
            return startGame(chatId);
        }

        const randomNumber = chats[chatId];

        if (parseInt(data) === randomNumber) {
            return bot.sendMessage(
                chatId,
                `Congratulations, you guessed the number ${randomNumber}`,
                againOptions
            );
        } else {
            return bot.sendMessage(
                chatId,
                `Sorry, your number is wrong. The number was ${randomNumber}`,
                againOptions
            );
        }
    });
}

start();
