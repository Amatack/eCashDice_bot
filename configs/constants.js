import dotenv from'dotenv'
dotenv.config()

export const token = process.env.BOT_TOKEN
export const authHash = process.env.AUTH_HASH
export const idChat = process.env.ID_CHAT
export const smtpPassword = process.env.SMTP
export const emailAddress = process.env.EMAIL
export const groupName = process.env.GROUP_NAME
export const idChannel = process.env.ID_CHANNEL
export const threadId = process.env.MESSAGE_THREAD_ID
export const eCashFootballHost = process.env.ECASHFOOTBALL_HOST
export const mainAdmin = process.env.MAIN_ADMIN
export const multAddrPrimary = process.env.MULT_ADDR_PRIMARY
export const multAddrSecondary = process.env.MULT_ADDR_SECONDARY