const TelegramApi = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const {gameOptions, againOptions} = require('./option');
const token = '5796518984:AAEOAhXXDHfU0Qep-bCni7YF9kguEsWFVhs'
const chats = {}
const bot = new TelegramApi(token, {polling: true})

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Я загадываю число от 0 до 9, а ты угадываешь)`)
    const randomNum = Math.floor (Math.random() * 10) + ''
    // fs.writeFile(path.resolve(__dirname, 'rrr.txt'), randomNum)
    // console.log(randomNum)
    chats[chatId] = randomNum;
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions);
}

const start = () => {
    let msg
    bot.setMyCommands([
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Угадай число'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start'){
            // await bot.sendSticker(chatId, 'https://www.pngall.com/ru/hello-png/download/49725'
            return  bot.sendMessage(chatId, `Добро пожаловать в телеграмм бот ShouZee MiniGame `)
        }
        if (text === '/info') {
            return  bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} `);
        }
        if (text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю(')

    })

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
           return startGame(chatId);
        }
        if (msg) {
          await  bot.deleteMessage(chatId, msg.id )
            msg = null
        }
        if (data === chats[chatId]) {
            msg = await bot.sendMessage(chatId,`Умница ты отгадал цифру ${chats[chatId]}`, againOptions);
        } else {
            msg = await  bot.sendMessage(chatId,`Ты не угадал я загадал цифру ${chats[chatId]} попробуй еще разок)`, againOptions)
        }

    })
}


start()