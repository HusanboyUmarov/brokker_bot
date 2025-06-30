const checkAuth = require("../../middlewares/registration.middleware");
const checkChannelSubscribe = require("../../middlewares/checkSubscribe.middleware")

const start = async (bot) => {
    bot.onText(/\/start/, async(msg) => {
        try {
            checkAuth(msg.from.first_name, msg.chat.id)
        } catch (error) {
            console.log(error.message)
            
        }

        bot.sendMessage(msg.chat.id,
            `👋 Assalomu aleykum ${msg.from.first_name}, Bizning bot nima qila oladi.\n
 1️⃣ Siz forma to'ldirasiz,
 2️⃣ Formangiz tekshiriladi va agar to'g'ri bo'sa kanalimizga post qilinadi (bu haqida habar beriladi) ✨
    
🚨 Diqqat bot sotib olingan va soltilgan mahsulotlara javob bermaydi. Biz faqat sotuvchi va haridorni bog‘lashga yordam beramiz!

✅ Agar biror mahsulotingizni sotmoqchi bo'lsangiz /sell ni bosing. \n
✅ Agar biror mahsulot sotib olmoqchi bo'lsangiz /buy ni bosing. \n
✨ Biz haqimizda /aboutUs
`);
    })

}

module.exports = start


