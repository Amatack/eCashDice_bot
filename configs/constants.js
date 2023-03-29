import dotenv from'dotenv'
dotenv.config()

export var timeoutId = new Array

export const token = process.env.BOT_TOKEN
export const idChat = process.env.ID_CHAT
export const smtpPassword = process.env.SMTP
export const emailAddress = process.env.EMAIL
export const idChannel = process.env.ID_CHANNEL
export const threadId = process.env.MESSAGE_THREAD_ID