const UserModel = require("../models/users")
const moment = require("moment")

const checkAuth = async (firstName, chatId, phone) => {
    const now = moment()
    const data = await UserModel.findOne({ chatId: chatId })
    if (!data) {
        await UserModel.create({ firstName, phone, chatId, date: now.format("YYYY-MM-DD") })
    }
}

module.exports = checkAuth