import moment from 'moment-timezone'

export async function everySecond(timeout,idChat, bot, callback){
    
    let now = moment.tz("Europe/Istanbul").format('HH:mm')
    
    if(now === "02:00" && timeout.first === false) {
        bot.telegram.sendMessage(idChat, `In 22 hours attempts reset to win`)
        timeout.twelfth = false
        timeout.first = true
    }

    if(now === "04:00" && timeout.second === false) {
        bot.telegram.sendMessage(idChat, `In 20 hours attempts reset to win`)
        timeout.first = false
        timeout.second = true
    }

    if(now === "06:00" && timeout.third === false) {
        bot.telegram.sendMessage(idChat, `In 18 hours attempts reset to win`)
        timeout.second = false
        timeout.third = true
    }

    if(now === "08:00" && timeout.fourth === false) {
        bot.telegram.sendMessage(idChat, `In 16 hours attempts reset to win`)
        timeout.third = false
        timeout.fourth = true
        
    }

    if(now === "10:00" && timeout.fifth === false) {
        bot.telegram.sendMessage(idChat, `In 14 hours attempts reset to win`)
        timeout.fourth = false
        timeout.fifth = true
    }

    if(now === "12:00" && timeout.sixth === false) {
        bot.telegram.sendMessage(idChat, `In 12 hours attempts reset to win`)
        timeout.fifth = false
        timeout.sixth = true
    }

    if(now === "14:00" && timeout.seventh === false) {
        bot.telegram.sendMessage(idChat, `In 10 hours attempts reset to win`)
        timeout.sixth = false
        timeout.seventh = true
    }

    if(now === "16:00" && timeout.eighth === false) {
        bot.telegram.sendMessage(idChat, `In 8 hours attempts reset to win`)
        timeout.seventh = false
        timeout.eighth = true
    }

    if(now === "18:00" && timeout.nineth === false) {
        bot.telegram.sendMessage(idChat, `In 6 hours attempts reset to win`)
        timeout.eighth = false
        timeout.nineth = true
    }

    if(now === "20:00" && timeout.tenth === false) {
        bot.telegram.sendMessage(idChat, `In 4 hours attempts reset to win`)
        timeout.nineth = false
        timeout.tenth = true
    }

    if(now === "22:00" && timeout.eleventh === false) {
        bot.telegram.sendMessage(idChat, `In 2 hours attempts reset to win`)
        timeout.tenth = false
        timeout.eleventh = true
    }
    callback(now, timeout.twelfth)
    if(now === "00:00" && timeout.twelfth === false) {
        bot.telegram.sendMessage(idChat, "⏳ Dice Timer has been reset! \n \n Everyone has a new try to get 3x1 (🎲 🎲🎲) for today. \n \n Good Luck🤞")
        timeout.eleventh = false
        timeout.twelfth = true
    }
}