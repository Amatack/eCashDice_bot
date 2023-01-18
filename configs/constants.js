import dotenv from'dotenv'
dotenv.config()

export var timeoutId = new Array

export const botAuth = process.env.BOT_TOKEN
export const idChat = process.env.ID_CHAT
export const paymentAddresses = process.env.PAYMENT_ADDRESSES.split(' ')
export const idModifier = process.env.ID_MODIFIER