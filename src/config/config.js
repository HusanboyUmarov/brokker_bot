require("dotenv").config()
const env = process.env

const config = {
    BOT_TOKEN: env.BOT_TOKEN,
    ADMIN_ID: env.ADMIN_ID,
    CHANNEL_ID: env.CHANNEL_ID,
    MONGO_DB: env.MONGO_DB
}

module.exports = config