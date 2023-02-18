import express from 'express'
import dotenv from 'dotenv'
import { Telegraf} from 'telegraf'

import dbConnect from './database.js'
import {everySecond} from './everySecond.js'
import { hoursLeft } from './hoursLeft.js'
import {smtp} from './smtp.js'
import { diceGamePayment } from './controllers/diceGamePayment.js'
import Addresses from "./models/PaymentAddresses.js";
import Availability from "./models/Availability.js";
import Release from './models/DiceRelease.js'
import Winner from './models/Winner.js'
import TemporaryRaffles from './models/TemporaryRaffles.js'
import { timeoutId,paymentAddresses} from "./configs/constants.js";
import { getName } from "./utils/name.js";

dotenv.config()

const token = process.env.BOT_TOKEN
if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}



const idChat = process.env.ID_CHAT
const idChannel = process.env.ID_CHANNEL
const bot = new Telegraf(token)

// Represents 24 hours
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

const smtpPassword = process.env.SMTP
const emailAddress = process.env.EMAIL
setInterval(() => {
    everySecond(timeout,idChat, bot, async (now, timeoutTwelfth)=>{
        timeLeft = now
        if(now === "00:00" && timeoutTwelfth === false){
            let messageEmail = new String
            const winners = await Winner.find()
            winners.forEach(element => {if(element.address) (messageEmail = messageEmail + " " + element.address)})
            await smtp(smtpPassword, messageEmail, emailAddress)
            await Winner.deleteMany({})
            await Release.deleteMany({})
            await TemporaryRaffles.deleteMany({})
            bot.telegram.sendMessage(idChannel, `#RESET \nNew chance to win`)
        }
    })
}, 1000)


bot.command('time', (ctx) => {
    let split = hoursLeft(timeLeft)
    ctx.reply(`In ` + split[0] + ":" + split[1] + " hours attempts reset to win")
})


bot.on('text', async (ctx) =>{

    const { from } = ctx.message
    
    const word = "ecash:"
    const winners = await Winner.find()
    for(let i = 0; i < winners.length; i++){
        if(winners[i].telegramId === from.id){
            let split = ctx.message.text.split(" ")
            split.forEach(async (element) => {
                if(element.length === 49 && element.includes(word)){
                    
                    await Winner.findOneAndUpdate(
                        { telegramId: from.id }
                        ,{ $set: { address: element } },
                        { new: true })
                    
                }
                
            });
            
        }
    }
})

bot.on('dice', async (ctx) => {
    
    const {dice, forward_from, from } = ctx.message
    // without: || forward_from. for tests 
    if(dice.emoji !== "🎲" || forward_from ) return
    console.log("dice")
    //Traducido como Lanzamientos de usuario en bd
    let userReleasesInBd = 0
    //Traducido sucessfulNumbersDice = Dados de numeros acertados
    let sucessfulNumbersDice = 0
    
    let user;
    //GET
    
    const releases = await Release.find()

    for(let i = 0; i < releases.length; i++){
        
        //you get objects
        user = releases[i]
        
        if(user.telegramId === from.id){
            
            userReleasesInBd++

            //For each die in 1
            if(user.value === 1){
                sucessfulNumbersDice++
            }

            if(userReleasesInBd === 3){
                return
            }
        }
    }
    
    if(userReleasesInBd < 3 && from.is_bot === false){

        const newRelease = new Release(
            {
                telegramId: from.id,
                value: dice.value,
            })
        
        const newWinner = new Winner(
            {
                telegramId: from.id
            })

        bot.telegram.sendMessage(idChannel, `#id${from.id} \nname: ${from.first_name} \nusername: @${from.username} \nvalue: ${dice.value} `)
        try {
            //POST
            
            //if(dice.value === 6 && userReleasesInBd < 1){
                //setTimeout(() => ctx.reply("🎲 Congratulations, you have rolled a Six (6) on your first roll. \n \n You didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens. \n \n 👉 Reply to this message with your eToken:address and we will send you some Grumpy (GRP). \n \n ℹ️ If you don't have an eCash wallet that support eTokens, you can create one at https://cashtab.com web-wallet. \n \n ⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
                //await newWinner.save()
            //}

            if(dice.value === 1 && userReleasesInBd < 1){
                const name = getName(from)
                const DirectionsUsing = await Availability.findOne({getValues: "easily"})

                let addressValid = 0
                for (const property in DirectionsUsing){
                    if(property === "1" || property === "2" || property === "3" || property === "4")
                        
                        if(DirectionsUsing[property] === false){
                            addressValid = Number(property)
                            break
                        }
                }
                if(addressValid === 0) {
                    ctx.reply("Congestion of pending payments, try to play another time")
                    return
                }

                
                timeoutId[addressValid-1] = setTimeout(async () => {
                    
                    await Availability.findOneAndUpdate(
                        {getValues: "easily"},
                        { $set: { [addressValid]: false } },
                        { new: false })
                    await Addresses.deleteOne({telegramId: from.id, paymentReason: "Dice"})
                    },
                    
                    //900000 son 15 minutos
                    900000)
                
                setTimeout(async () => {
                            await Availability.findOneAndUpdate(
                                {getValues: "easily"},
                                { $set: { [addressValid]: true } },
                                { new: true })

                            const Address = new Addresses(
                                {
                                    telegramId: from.id,
                                    address: paymentAddresses[addressValid-1],
                                    paymentReason: "Dice",
                                    amount:1000000
                                }
                            )
                            
                            await Address.save()
                            
                            await ctx.replyWithHTML(`${name} multiply x3 possible reward by paying 1 million Grumpy ($GRP) to this address:\n\n<code>${paymentAddresses[addressValid-1]}</code>\n\n#Pending_payment\nPay in under 15 minutes after your payment will not be valid`)
                }, 3750)
            }
            
            if(sucessfulNumbersDice === 2){
                if(dice.value === 1 ){
                setTimeout( () => {ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's top prize of 250.000 XEC🏅 \n \nPlease reply to this message with your eCash (XEC) wallet address and admin @e_Koush will reward you as soon as possible!")}, 3000)
                }else{
                    setTimeout(() => ctx.reply("🎲 Aww, almost! \n \nYou didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens, instead! \n \n👉 Please share your eCash address. Note that your wallet needs to support eTokens. We recommend creating a wallet on Cashtab.com. If you are not sure if your wallet supports eTokens, feel free to ask! \n \n⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
                    await newWinner.save()
                }
            }
            
            await newRelease.save()
            
        } catch (error) {
            console.log("Error saving to database")
        }
    }
})

//-EXPRESS--------

const app = express();

app.set('port', process.env.PORT || 8080)


//middlewares
app.use(express.json())

//app.use('/dice', Transacctions)

app.post('/diceGamePayment', diceGamePayment)

app.use((req, res) => {
    return res.status(404).json({
        error: "Not Found data",
    })
})

app.listen(app.get('port'))
console.log('Server on: http://localhost:'+app.get('port'))

dbConnect()
bot.launch()

