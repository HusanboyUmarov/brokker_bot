const Bot = require("node-telegram-bot-api")
const mongoose = require("mongoose")
const config = require("./config/config");
const { bootstrap } = require("./bot/bot");

const connectDb = async () => {
  try {
    mongoose.connect(config.MONGO_DB);
    console.log("DB connected");
  } catch (error) {
    console.log(error, "Ups! Database does not connect.");
  }
};

connectDb();

// Bot 
bootstrap()