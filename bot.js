import dotenv from 'dotenv'
import { Telegraf } from 'telegraf'

import {createConnection, getConnection} from './database.js'
import {everySecond} from './everySecond.js'
import { hoursLeft } from './hoursLeft.js'
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

let timeLeft = new String

const db = getConnection()
const smtpPassword = process.env.SMTP
setInterval(() => {
    everySecond(timeout,idChat, bot, async (now, timeoutTwelfth)=>{
        timeLeft = now
        if(now === "00:00" &&  timeoutTwelfth === false){
            let messageEmail = new String
            db.data.winners.forEach(element => {if(element.address) (messageEmail = messageEmail + " " + element.address)})
            await smtp(smtpPassword, messageEmail)
            bot.telegram.sendMessage(idChannel, `#RESET \nNew chance to win`)
            db.data.releases = []
            db.data.winners = []
            await db.write()
        }
    })
}, 1000)


bot.command('time', (ctx) => {
    let split = hoursLeft(timeLeft)
    ctx.reply(`In ` + split[0] + ":" + split[1] + " hours attempts reset to win")
})


bot.command('z', () => {
    smtp(smtpPassword, db.data)
})

bot.on('text', (ctx) =>{
    const winner = {
        address: new String
    }
    const word = "etoken:"
    //let positionWinner = new Number
    for(let i = 0; i < db.data.winners.length; i++){
        if(db.data.winners[i].id === ctx.message.from.id){
            let split = ctx.message.text.split(" ")
            split.forEach(async (element) => {
                if(element.length === 49 && element.includes(word)){
                    //console.log(element)
                    winner.address = element
                    db.data.winners[i] = winner
                    await db.write()
                    
                }
                
            });
            
        }
    }
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
        const winner = {
            id: from.id
        }
        bot.telegram.sendMessage(idChannel, `#id${release.id} \nname: ${from.first_name} \nusername: @${from.username} \nvalue: ${release.value} `)
        try {
            //POST
            db.data.releases.push(release)
            //if(dice.value === 6 && userReleasesInBd < 1){
                //setTimeout(() => ctx.reply("🎲 Congratulations, you have rolled a Six (6) on your first roll. \n \n You didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens. \n \n 👉 Reply to this message with your eToken:address and we will send you some Grumpy (GRP). \n \n ℹ️ If you don't have an eCash wallet that support eTokens, you can create one at https://cashtab.com web-wallet. \n \n ⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
                //db.data.winners.push(winner)
            //}
            
            if(sucessfulNumbersDice === 2){
                if(dice.value === 1 ){
                setTimeout( () => ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's top prize of 250.000 XEC🏅 \n \nPlease reply to this message with your eCash (XEC) wallet address and admin @e_Koush will reward you as soon as possible!"), 3000)
                }else{
                    setTimeout(() => ctx.reply("🎲 Aww, almost! \n \nYou didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens, instead! \n \n👉 Reply with your eToken:address and we will send you some Grumpy (GRP). \n \nℹ️ If you don't have an eCash wallet that support eTokens, you can create one at https://cashtab.com web-wallet. \n \n⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
                    db.data.winners.push(winner)
                }
            }
            await db.write()
            
        } catch (error) {
            console.log("Error al guardar en base de datos ")
        }
    }
})


bot.launch()

