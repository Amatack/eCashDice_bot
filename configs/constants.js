import dotenv from'dotenv'
dotenv.config()

export const token = process.env.BOT_TOKEN
export const authHash = process.env.AUTH_HASH
export const idChat = process.env.ID_CHAT
export const smtpPassword = process.env.SMTP
export const emailAddress = process.env.EMAIL
export const idChannel = process.env.ID_CHANNEL
export const threadId = process.env.MESSAGE_THREAD_ID
export const eCashFootballHost = process.env.ECASHFOOTBALL_HOST