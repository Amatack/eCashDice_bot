import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'

//import {on} from 'nodemon'

import {createConnection, getConnection} from './database.js'
import {taskSchedule} from './taskSchedule.js'
import {smtp} from './smtp.js'
dotenv.config()

const token = process.env.BOT_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

const idChat = process.env.ID_CHAT
const idChannel = process.env.ID_CHANNEL
const bot = new Telegraf(token)

createConnection()
// Representa las 24 horas
let HoursLeft = 28800

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
        // 1200
        HoursLeft = Hours
        console.log(HoursLeft)
        //Solo me falta el id de la linea 37 lo demas está bien
        if(HoursLeft === 26400 || HoursLeft === 24000 || HoursLeft === 21600 || HoursLeft === 19200 || HoursLeft === 16800 || HoursLeft === 24000 || HoursLeft === 14400 || HoursLeft === 12000 || HoursLeft === 9600 || HoursLeft === 7200 || HoursLeft === 4800 || HoursLeft === 2400)  bot.telegram.sendMessage(-1001730725038, `In ${Math.ceil(db.data.hoursLeft / 1200)} hours Attempts reset to win`);
        if(HoursLeft === 28800) {
            bot.telegram.sendMessage(idChat, "⏳ Dice Timer has been reset! \n \n Everyone has a new try to get 3x1 (🎲 🎲🎲) for today. \n \n Good Luck🤞")
            bot.telegram.sendMessage(idChannel, `#RESET \nNew chance to win`)
            db.data.releases = []
        }
        await db.write()
    })
})



const db = getConnection()

bot.command('hoursleft', (ctx) => ctx.reply(`In ` +  Math.ceil(db.data.hoursLeft / 1200) + " hours Attempts reset to win"))

const smtpPassword = process.env.SMTP
bot.command('z', () => {
    smtp(smtpPassword, db.data)
})


bot.on('dice', (ctx) => {
    const {dice, forward_from, from } = ctx.message
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
        if(user.id === from.id){
            
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

    if(dice.emoji === "🎲" && userReleasesInBd < 3 && !forward_from && from.is_bot === false){
        const release = {
            id: from.id,
            value: dice.value,
        }
        bot.telegram.sendMessage(idChannel, `#id${release.id} \nname: ${from.first_name} \nusername: @${from.username} \nvalue: ${release.value} `)
        try {
            //POST
            db.data.releases.push(release)
            if(dice.value === 6 && userReleasesInBd < 1){
                db.write()
                setTimeout(() => ctx.reply("🎲 Congratulations, you have rolled a Six (6) on your first roll. \n \n You didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens. \n \n 👉 Reply to this message with your eToken:address and we will send you some Grumpy (GRP). \n \n ℹ️ If you don't have an eCash wallet that support eTokens, you can create one at https://cashtab.com web-wallet. \n \n ⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
                return
                
            }
            
            if(dice.value === 1 && sucessfulNumbersDice === 2){
                db.write()
                setTimeout( () => ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's top prize of 1.000.000 XEC🏅 \n \nPlease reply to this message with your eCash (XEC) wallet address and admin @e_Koush will reward you as soon as possible!"), 3000)
                return
            }
            
        } catch (error) {
            console.log("Error al guardar en base de datos ")
        }
    }
})


bot.launch()

