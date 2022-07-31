import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'
//const axios = require('axios')
//import {on} from 'nodemon'

import {createConnection, getConnection} from './database.js'
import {taskSchedule} from './taskSchedule.js'
dotenv.config()

const token = process.env.BOT_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

createConnection()
let HoursLeft = 24

const getTotalHours = async(Hours, callback) =>{
    const db = getConnection()
    await db.read()
    Hours = db.data.hoursLeft
    
    callback(Hours)
}

getTotalHours(HoursLeft, (Hours)=>{
    console.log(Hours)
    taskSchedule(Hours, async (Hours) => {
    
        const db = getConnection()
        db.data.hoursLeft = Hours
        HoursLeft = Hours
        console.log(HoursLeft)
        if(Hours === 24) db.data.releases = []
        await db.write()
    })
})



const bot = new Telegraf(token)

//bot.start(async (ctx)=>{
    //await ctx.reply("Hola")
//})

//bot.command('random', async (ctx) =>{
    //const db = getConnection()
    //await ctx.reply(db.data.releases)
    
//})

//bot.command('winners', async (ctx) =>{
    //await ctx.replyWithDice({emoji:"🎯"})
//} )

bot.on('dice', async (ctx) => {
    if(ctx.message.dice.emoji === "🎲"){
        const release = {
            id: ctx.message.from.id,
            value: ctx.message.dice.value
        }
        //console.log(ctx.message.dice.value)
        try {

            const db = getConnection()
            //GET
            const user = db.data.releases.filter(userLaunch => userLaunch.id === ctx.message.from.id);
            //POST
            if(user.length < 2){
                db.data.releases.push(release)
                await db.write()
            }else{
                await ctx.reply("Oops, you have exceeded the maximum limit of daily releases, wait " + HoursLeft + "seconds to win")
            }
        } catch (error) {
            console.log("Error al guardar en base de datos")
        }
    }
})

bot.launch()

