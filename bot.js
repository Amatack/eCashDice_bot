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
const bot = new Telegraf(token)
createConnection()
let HoursLeft = 24

const getTotalHours = async(Hours, callback) =>{
    const db = getConnection()
    await db.read()
    Hours = db.data.hoursLeft
    callback(Hours)
}

getTotalHours(HoursLeft, (Hours)=>{
    taskSchedule(Hours, async (Hours) => {
    
        const db = getConnection()
        db.data.hoursLeft = Hours
        HoursLeft = Hours
        console.log(HoursLeft)
        if(Hours === 20) db.data.releases = []
        await db.write()
    })
})

const db = getConnection()
bot.on('dice', (ctx) => {
    let stop = false
    let value;
    //GET
    //const user = db.data.releases.filter(async (userLaunch) => await userLaunch.id === ctx.message.from.id);
    for(let i = 0; i < db.data.releases.length; i++){
        console.log(db.data.releases[i])
        
        value = db.data.releases[i]
        
        if(value.id === ctx.message.from.id){
            stop = true
            return
        }
    }
    if(ctx.message.dice.emoji === "🎲" && stop === false){
        const release = {
            id: ctx.message.from.id,
            value: ctx.message.dice.value
        }
        try {
            //POST
            db.data.releases.push(release)
            if(ctx.message.dice.value === 6){
                setTimeout( () => ctx.reply("Congratulation!"), 4000 )
            }
            db.write()
        } catch (error) {
            console.log("Error al guardar en base de datos")
        }
    }
})

bot.launch()

