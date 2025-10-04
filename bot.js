import { Telegraf} from 'telegraf'
import {message} from 'telegraf/filters'

import dbConnect from './database.js'
import {everySecond} from './everySecond.js'
import { hoursLeft } from './hoursLeft.js'
import {smtp} from './smtp.js'
import Release from './models/DiceRelease.js'
import {token, idChat, idChannel, smtpPassword, emailAddress, threadId } from './configs/constants.js'
import userAddresses from './models/UserAddresses.js'
import DiceGameMessages from './models/DiceGameMessages.js'
import withRedeemingToken from "./models/withRedeemingToken.js";
import DartsGameState from './models/DartsGameState.js'
import SlotGameWinner from './models/SlotGameWinner.js'
import DiceMultiplier from './models/DiceMultiplier.js'

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
            
            //await smtp(smtpPassword, messageEmail, emailAddress)
            await Release.deleteMany({})
            await DartsGameState.updateMany(
                { played: { $ne: false } },
                { $set: { played: false } }
                )
            await userAddresses.deleteMany({ address: { $exists: false } })
            await withRedeemingToken.deleteMany({})
            await SlotGameWinner.deleteMany({})

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
                    setTimeout(async () => {await ctx.deleteMessage(message_id)}, 3000)
                    if(allDiceGameMessages.length === 0){

                        const diceGameMessages = DiceGameMessages({
                            tgId: from.id,
                            overGameMessageId: message_id2,
                        })
        
                        await diceGameMessages.save()
                        
                    }else{
                        
                        //empty object to modify the first document found 
                        await DiceGameMessages.findOneAndUpdate({},
                            {   
                                $set: {
                                    tgId: from.id,
                                    overGameMessageId: message_id2,
                                }
                            },{ new: false }
                        )
                        await ctx.deleteMessage(allDiceGameMessages[0].overGameMessageId)
                    }
                    
                    
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
        

        bot.telegram.sendMessage(idChannel, `#id${from.id} \nname: ${from.first_name} \nusername: @${from.username} \nvalue: ${dice.value} `)
        try {
            //POST
            
            //if(dice.value === 6 && userReleasesInBd < 1){
                //setTimeout(() => ctx.reply("🎲 Congratulations, you have rolled a Six (6) on your first roll. \n \n You didn't win the Jackpot (3x One) but you will be rewarded some #Grumpy😾 eTokens. \n \n 👉 Reply to this message with your eToken:address and we will send you some Grumpy (GRP). \n \n ℹ️ If you don't have an eCash wallet that support eTokens, you can create one at https://cashtab.com web-wallet. \n \n ⚠️Note: After setting up your new wallet, please take the time to go to the ⚙️Settings menu to write down and store your 12 Word Seed Phrase. It acts as your Backup to your funds in case of loss of device. Keep this 12 Word Backup Phrase Safe and do not disclose it to anyone."), 3000)
            //}
            if(userReleasesInBd < 1){
                const withAddress = await userAddresses.findOne({ tgId: from.id })
                //Suggestion to enter address
                if(!withAddress){
                    ctx.replyWithHTML(`Welcome ${from.first_name}\n\nTo be able to receive rewards, please register your eCash address by using the /register command, followed by your address.\n\nExample:\n\n<code>/register ecash:address</code>`)
                    const userAddress = {
                        tgId: from.id
                    }

                    const newUserAddress = new userAddresses(userAddress)
                    await newUserAddress.save()
                    return
                }

                if(!withAddress.address){
                    ctx.replyWithHTML(`Welcome ${from.first_name}\n\nTo be able to receive rewards, please register your eCash address by using the /register command, followed by your address.\n\nExample:\n\n<code>/register ecash:address</code>`)
                    return
                }
                //The user has made 1 correct throw
                if(dice.value === 1 ){
                    await ctx.replyWithHTML(`${from.first_name} multiply x2 possible reward by paying 1 million Grumpy ($GRP) or 100 cachet ($CACHET) to this address:\n\n<code>ecash:qq5v4wmfhclzqur4wnt6phwxt2qpk6h9nyesy04fn0</code>`)
                }
            }
            //The user has made 2 correct throws
            if(sucessfulDiceNumbers === 1 && dice.value === 1){
                const withDiceMultiplier = await DiceMultiplier.find()

                if(withDiceMultiplier.length === 0){
                    const diceMultiplier = {
                        tgId: from.id,
                        multiplier: false
                    }

                    const newDiceMultiplier = new DiceMultiplier(diceMultiplier)
                    await newDiceMultiplier.save()
                }else{
                    //empty object to modify the first document found 
                    await DiceMultiplier.findOneAndUpdate({},
                        {   
                            $set: {
                                tgId: from.id,
                                multiplier: false,
                            }
                        },{ new: false }
                    )
                }
            }
            //The user has made 3 correct throws
            if(sucessfulDiceNumbers === 2){

                const userAddress = await userAddresses.findOne({ tgId: from.id });
                
                if(userAddress === null && dice.value === 1){
                    setTimeout( () => ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's reward!🏅 \n \nPlease reply to this message with your eCash (XEC) wallet address and admin @eKoush will reward you as soon as possible!"), 3000)
                }else if(userAddress !== null && dice.value === 1){
                    setTimeout( () => ctx.reply("🎉 Congratulations! \n \nYou have won the 🎲 Dice Game's reward!🏅 \n \nYour address registered is\n"+userAddress.address+"\n\nAdmin @eKoush will reward you as soon as possible!"), 3000)
                }
            }

            await newRelease.save()
            
        } catch (error) {
            console.error("Error saving to database")
        }
    }
})

dbConnect()
bot.launch()

