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
        if(Hours === 24) db.data.releases = []
        await db.write()
    })
})

const db = getConnection()

bot.command('HoursLeft', (ctx) => ctx.reply("In " + db.data.hoursLeft + " hours, Attempts reset to win"))

bot.on('dice', (ctx) => {
    //Traducido como Lanzmientos de usuario en bd
    let userReleasesInBd = 0
    //Traducido sucessfulNumbersDice = Dados de numeros acertados
    let sucessfulNumbersDice = 0
    
    let user;
    //GET
    
    for(let i = 0; i < db.data.releases.length; i++){
        //console.log(db.data.releases[i])
        
        //Obtienes ojetos del array releases
        user = db.data.releases[i]
        
        //Obtienes objetos que son lanzamientos del usuario que lanzo el dado
        if(user.id === ctx.message.from.id){
            
            userReleasesInBd++

            // Por cada dado en 1 acertado
            if(user.value === 1){
                sucessfulNumbersDice++
            }

            if(userReleasesInBd === 3){
                return
            }
        }
    }
    if(ctx.message.dice.emoji === "🎲" && userReleasesInBd < 3){
        const release = {
            id: ctx.message.from.id,
            value: ctx.message.dice.value,
        }
        try {
            //POST
            db.data.releases.push(release)
            if(ctx.message.dice.value === 6 && userReleasesInBd < 1){
                db.write()
                setTimeout( () => ctx.reply("🏅Congratulation!, You have earned grumpy tokens,@e_Koush or @Amatack or @NoExtrex will reward you"), 3500)
                return
            }
            
            if(ctx.message.dice.value === 1 && sucessfulNumbersDice === 2){
                db.write()
                setTimeout( () => ctx.reply("🥇Congratulation!, You've hit the jackpot,@e_Koush will reward you"), 3500)
                return
            }
            
        } catch (error) {
            console.log("Error al guardar en base de datos ")
        }
    }
})

bot.launch()

