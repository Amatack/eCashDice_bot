import { Telegraf } from 'telegraf'
import { timeoutId, botAuth, idChat, idModifier } from '../configs/constants.js';
import {getName} from '../utils/name.js'

const bot = new Telegraf(botAuth);

export const diceGamePayment = async(req, res) => {
    try {
        clearTimeout(timeoutId[req.body.position-1])
        const sender = await bot.telegram.getChat(req.body.telegramid-Number(idModifier))
        const name = getName(sender)
        await bot.telegram.sendMessage(idChat, name+req.body.mainResponse+"\n\n"+`<a href='https://explorer.e.cash/tx/${req.body.txid}' target='_blank' rel='noopener noreferrer'>Ver transacción en explorador</a>`,
        {parse_mode:'HTML'}
    )
    } catch (error) {
        console.log(error)
    }
    
    return res.status(200).json({
        message: "Hello from path!",
    });
}