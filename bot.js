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
// Representa las 24 horas
let HoursLeft = 28800000

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
        // esto es una hora si divides sus ms totales / 3
        // 1200000
        HoursLeft = Hours
        console.log(HoursLeft)
        if(Hours === 28800000) db.data.releases = []
        await db.write()
    })
})

const db = getConnection()

bot.command('hoursleft', (ctx) => ctx.reply("In " + Math.ceil(db.data.hoursLeft / 1200000) + " hours, Attempts reset to win"))

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
                setTimeout( () => ctx.reply(`🎲 Congratulations, you have rolled a Six (6) on your first roll.\n \n 
                You didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens. \n \n 
                👉 Reply to this message with your eToken:address and we will send you some Grumpy (GRP). \n \n 
                ℹ️ If you don't have an eCash wallet that support eTokens, you create one at https://cashtab.com web-wallet.\n \n
                ⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone.`), 3500)
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

