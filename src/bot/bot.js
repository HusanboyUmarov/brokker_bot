const BOT = require("node-telegram-bot-api")
const config = require("../config/config")
const {sell, buy} = require("./commands/commands")
const start = require("./commands/start.command")
const { sellQuery } = require("./functions/sellQuery")
const {buyQuery} = require("./functions/buyQuery")
const aboutUs = require("./commands/aboutUs")


const bootstrap = async () => {
    try {
        const bot = new BOT(config.BOT_TOKEN, { polling: true })
        start(bot)
        sell(bot)
        buy(bot)
        sellQuery(bot)
        buyQuery(bot)
        aboutUs(bot)


    } catch (error) {
        console.log(error)
    }
}



module.exports = { bootstrap }


