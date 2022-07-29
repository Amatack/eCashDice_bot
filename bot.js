import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
//const axios = require('axios')
//import {on} from 'nodemon'

import {createConnection} from './database.js'
dotenv.config()

const token = process.env.BOT_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

createConnection()

const bot = new Telegraf(token)

bot.start((ctx)=>{
    ctx.reply("Hola")
})

bot.command('random', (ctx) =>{
    //ctx.reply(random(6))
    //ctx.replyWithDice()
    ctx.replyWithSticker('CAACAgEAAxkBAAOsX9WKywuspdVls5VSf9xV6ZLHrqAAAg8AA5390hUNDOUjryN26R4E')
    
} )

// bot.on('dice', async (ctx) => {
//     console.log(ctx.message)
//     await 

//     ctx.reply(`Value: ${ctx.message}`)
// })

bot.launch()

