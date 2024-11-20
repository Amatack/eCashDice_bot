import { Telegraf} from 'telegraf'
import {message} from 'telegraf/filters'

import dbConnect from './database.js'
import {everySecond} from './everySecond.js'
import { hoursLeft } from './hoursLeft.js'
import {smtp} from './smtp.js'
import Release from './models/DiceRelease.js'
import Winner from './models/Winner.js'
import {token, idChat, idChannel, smtpPassword, emailAddress, threadId } from './configs/constants.js'
import userAddresses from './models/UserAddresses.js'
import DiceGameMessages from './models/DiceGameMessages.js'
import DartsScore from './models/DartsScore.js'
import withRedeemingToken from "./models/withRedeemingToken.js";

if (token === undefined) {
    throw new Error('BOT_TOKEN must be provided!')
}

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

setInterval(() => {
    everySecond(timeout,idChat, bot, async (now, timeoutTwelfth)=>{
        timeLeft = now
        if(now === "00:00" && timeoutTwelfth === false){
            let messageEmail = new String
            const winners = await Winner.find()
            winners.forEach(element => {if(element.address) (messageEmail = messageEmail + " " + element.address)})
            //await smtp(smtpPassword, messageEmail, emailAddress)
            await Winner.deleteMany({})
            await Release.deleteMany({})
            await DartsScore.deleteMany({})
            await userAddresses.deleteMany({ address: { $exists: false } })
            await withRedeemingToken.deleteMany({})

            bot.telegram.sendMessage(idChannel, `#RESET \nNew chance to win`)
        }
    })
}, 1000)


bot.command('time', (ctx) => {
    let split = hoursLeft(timeLeft)
    ctx.reply(`In ` + split[0] + ":" + split[1] + " hours attempts reset to win")
})


bot.on(message("text"), async (ctx) =>{

    const { from, chat } = ctx.message
    
    if(chat.id !== Number(idChat))return

    const word = "ecash:"

    const withAddress = await userAddresses.find({ tgId: from.id })

    //Suggestion to enter address
    if(withAddress.length === 0 ){
        ctx.replyWithHTML(`Welcome ${from.first_name}\n\nTo be able to receive rewards, please register your eCash address by using the /register command, followed by your address.\n\nExample:\n\n<code>/register eCash:address</code>`)
        const userAddress = {
            tgId: from.id
        }

        const newUserAddress = new userAddresses(userAddress)
        await newUserAddress.save()
    }
    const winners = await Winner.find()
    for(let i = 0; i < winners.length; i++){
        if(winners[i].telegramId === from.id){
            let split = ctx.message.text.split(" ")
            split.forEach(async (element) => {
                if(element.length === 48 && element.includes(word)){
                    await Winner.findOneAndUpdate(
                        { telegramId: from.id }
                        ,{ $set: { address: element } },
                        { new: true })
                }
                
            });
            
        }
    }
})

bot.on(message("dice"), async (ctx) => {
    
    const {dice, forward_from, from, message_thread_id, message_id, chat } = ctx.message

    if(chat.id !== Number(idChat))return

    // without: || forward_from. for tests 
    if(dice.emoji !== "🎲" || forward_from) return

    if(Number(threadId) !== message_thread_id){
        await ctx.deleteMessage(message_id)
        return
    }

    let userReleasesInBd = 0
    
    let sucessfulDiceNumbers = 0
    
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
                sucessfulDiceNumbers++
            }

            if(userReleasesInBd === 3){
                try {
                    const allDiceGameMessages = await DiceGameMessages.find()
                    
                    const {message_id: message_id2} = await ctx.reply("Oh-Oh, you already rolled for today. You can try again tomorrow. Use the /time command to check how many hours are left for your next chance to win!",{
                        reply_to_message_id: message_id,
                    })
                    if(allDiceGameMessages.length === 0){

                        const diceGameMessages = DiceGameMessages({
                            tgId: from.id,
                            overGameMessageId: message_id2,
                        })
        
                        await diceGameMessages.save()
                        
                    }else{
                        
                        await ctx.deleteMessage(allDiceGameMessages[0].overGameMessageId)
                        //empty object to modify the first document found 
                        await DiceGameMessages.findOneAndUpdate({},
                            {   
                                $set: {
                                    tgId: from.id,
                                    overGameMessageId: message_id2,
                                }
                            },{ new: false }
                        )
                    }

                    setTimeout(() => ctx.deleteMessage(message_id), 3000)
                } catch (error) {
                    console.error("Error from condition userReleasesInBd === 3: ", error)
                }
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
        
        const userWinner = {
            telegramId: from.id
        }
        
        const newWinner = new Winner(userWinner)

        bot.telegram.sendMessage(idChannel, `#id${from.id} \nname: ${from.first_name} \nusername: @${from.username} \nvalue: ${dice.value} `)
        try {
            //POST
            
            //if(dice.value === 6 && userReleasesInBd < 1){
                //setTimeout(() => ctx.reply("🎲 Congratulations, you have rolled a Six (6) on your first roll. \n \n You didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens. \n \n 👉 Reply to this message with your eToken:address and we will send you some Grumpy (GRP). \n \n ℹ️ If you don't have an eCash wallet that support eTokens, you can create one at https://cashtab.com web-wallet. \n \n ⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
                //await newWinner.save()
            //}
            if(userReleasesInBd < 1){
                if(dice.value === 1 ){
                    await ctx.replyWithHTML(`${from.first_name} multiply x2 possible reward by paying 1 million Grumpy ($GRP) to this address:\n\n<code>ecash:qq5v4wmfhclzqur4wnt6phwxt2qpk6h9nyesy04fn0</code>`)
                }else{
                    const withAddress = await userAddresses.find({ tgId: from.id })

                    //Suggestion to enter address
                    if(withAddress.length === 0 ){
                        ctx.replyWithHTML(`Welcome ${from.first_name}\n\nTo be able to receive rewards, please register your eCash address by using the /register command, followed by your address.\n\nExample:\n\n<code>/register ecash:address</code>`)
                        const userAddress = {
                            tgId: from.id
                        }

                        const newUserAddress = new userAddresses(userAddress)
                        await newUserAddress.save()
                    }
                }
            }
            
            if(sucessfulDiceNumbers === 2){

                const userAddress = await userAddresses.findOne({ tgId: from.id });
                
                if(userAddress === null && dice.value === 1){
                    setTimeout( () => ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's reward!🏅 \n \nPlease reply to this message with your eCash (XEC) wallet address and admin @eKoush will reward you as soon as possible!"), 3000)
                }else if(userAddress !== null && dice.value === 1){
                    setTimeout( () => ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's reward!🏅 \n \nYour address registered is\n"+userAddress.address+"\n\nAdmin @eKoush will reward you as soon as possible!"), 3000)
                }else{
                    if(userAddress === null){
                        setTimeout(() => ctx.reply("🎲 Aww, almost! \n \nYou didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens, instead! \n \n👉 Please share your eCash address. Note that your wallet needs to support eTokens. We recommend creating a wallet on Cashtab.com. If you are not sure if your wallet supports eTokens, feel free to ask! \n \n⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
                    }else{
                        newWinner.address = userAddress.address
                        setTimeout(() => ctx.reply("🎲 Aww, almost! \n \nYou didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens, instead! \n \n👉 Your address registered is\n"+userAddress.address+"\n\nAdmin @eKoush will reward you as soon as possible!"), 3000)
                    }
                    
                    await newWinner.save()
                }
            }

            await newRelease.save()
            
        } catch (error) {
            console.log("Error saving to database")
        }
    }
})

dbConnect()
bot.launch()

