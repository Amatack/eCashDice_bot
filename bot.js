require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios')
const {on} = require('nodemon')

function random(number){
    return Math.ceil(Math.random() * number)
}
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx)=>{
    ctx.reply("hola mundo")
})

bot.command('random', (ctx) =>{
    //ctx.reply(random(6))
    ctx.replyWithDice()
    //ctx.replyWithSticker('CAACAgEAAxkBAAOsX9WKywuspdVls5VSf9xV6ZLHrqAAAg8AA5390hUNDOUjryN26R4E')
    
} )

bot.on('dice', async (ctx) => {
    console.log(ctx.message)
    await 
    
    
    ctx.reply(`Value: ${ctx.message}`)
})

bot.launch();