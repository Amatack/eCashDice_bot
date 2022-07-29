import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
//const axios = require('axios')
//import {on} from 'nodemon'

import {createConnection, getConnection} from './database.js'
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

bot.command('random', async (ctx) =>{
    const db = getConnection()
    await ctx.reply(db.data.Users)
    
} )

bot.on('dice', async (ctx) => {
    const User = {
        id: ctx.message.from.id,
        value: ctx.message.dice.value
    }
    //console.log(ctx.message.from.id)
    try {
        const db = getConnection()
        db.data.Users.push(User)
        await db.write()
    } catch (error) {
        console.log("Error al guardar en base de datos")
    }
    
    //await ctx.reply(`Value: ${ctx.message}`)
})

bot.launch()

