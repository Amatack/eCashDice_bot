import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'

//import {on} from 'nodemon'

import {createConnection, getConnection} from './database.js'
//import {everySecond} from './everySecond.js'
//import {smtp} from './smtp.js'
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
let timeout = {
    first: false,
    second: false,
    fourth: false,
    third: false,
    fifth: false,
    sixth: false,
    seventh: false,
    eighth: false,
    nineth: false,
    tenth: false,
    eleventh: false,
    twelfth: false
}



const db = getConnection()
/*setInterval(() => {
    everySecond(timeout,idChat, bot, async (now, timeoutTwelfth)=>{
        
        if(now === "07:33" &&  timeoutTwelfth === false){
            
            bot.telegram.sendMessage(idChannel, `#RESET \nNew chance to win`)
            db.data.releases = []
            await db.write()
        }
    })
}, 1000)*/


//everySecond(Hours, async (Hours) => {

    //if(HoursLeft === 26400 || HoursLeft === 24000 || HoursLeft === 21600 || HoursLeft === 19200 || HoursLeft === 16800 || HoursLeft === 24000 || HoursLeft === 14400 || HoursLeft === 12000 || HoursLeft === 9600 || HoursLeft === 7200 || HoursLeft === 4800 || HoursLeft === 2400)  bot.telegram.sendMessage(idChat, `In ${Math.ceil(db.data.hoursLeft / 1200)} hours Attempts reset to win`);
    //if(HoursLeft === 28800) {
        //bot.telegram.sendMessage(idChat, "⏳ Dice Timer has been reset! \n \n Everyone has a new try to get 3x1 (🎲 🎲🎲) for today. \n \n Good Luck🤞")
        //bot.telegram.sendMessage(idChannel, `#RESET \nNew chance to win`)
        //db.data.releases = []
    //}
    //await db.write()
//})


//bot.command('hoursleft', (ctx) => ctx.reply(`In ` +  timeLeft + " hours Attempts reset to win"))

const smtpPassword = process.env.SMTP
bot.command('z', () => {
    smtp(smtpPassword, db.data)
})

bot.on('dice', async (ctx) => {
    
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
                setTimeout(() => ctx.reply("🎲 Congratulations, you have rolled a Six (6) on your first roll. \n \n You didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens. \n \n 👉 Reply to this message with your eToken:address and we will send you some Grumpy (GRP). \n \n ℹ️ If you don't have an eCash wallet that support eTokens, you can create one at https://cashtab.com web-wallet. \n \n ⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
            }
            
            if(dice.value === 1 && sucessfulNumbersDice === 2){
                setTimeout( () => ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's top prize of 1.000.000 XEC🏅 \n \nPlease reply to this message with your eCash (XEC) wallet address and admin @e_Koush will reward you as soon as possible!"), 3000)
            }
            await db.write()
            
        } catch (error) {
            console.log("Error al guardar en base de datos ")
        }
    }
})


bot.launch()

