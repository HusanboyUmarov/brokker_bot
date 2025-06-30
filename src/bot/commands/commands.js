const checkChannelSubscribe = require("../../middlewares/checkSubscribe.middleware");
const { sellProducts,buyProducts } = require("../buttons/buttons");

const sell = async (bot) => {
    bot.onText(/\/sell/, async(msg) => {

        try {

            const result = await checkChannelSubscribe(bot, msg?.from?.id)

            if(!result){
               return bot.sendMessage(msg?.from?.id, `Iltimos botdan to'liq foydalanish uchun kanalga a'zo bo'ling:
https://t.me/techBozor_Official
                `,
                {
                    disable_web_page_preview: true
                })
            }


        } catch (error) {
            console.log(error.message)
        }

        bot.sendMessage(msg.chat.id,
            `Yaxshi, endi sizning sotmoqchi bo'lgan mahsulotingiz haqida forma to'ldiramiz,Siz nima sotmoqchisiz`,
    sellProducts
        );
    })
    
}
const buy = async (bot) => {
    bot.onText(/\/buy/, async(msg) => {

        try {
            const result = await checkChannelSubscribe(bot, msg?.from?.id)

            if(!result){
               return bot.sendMessage(msg?.from?.id, `Iltimos botdan to'liq foydalanish uchun kanalga a'zo bo'ling:
https://t.me/techBozor_Official
                `,
                {
                    disable_web_page_preview: true
                })
            }


        } catch (error) {
            console.log(error.message)
        }

        bot.sendMessage(msg.chat.id,
            `Yaxshi, endi sizning sotib olmoqchi bo'lgan mahsulotingiz haqida forma to'ldiramiz,Siz nima siz nima kerak`,
    buyProducts
        );
    })
}

module.exports = {sell, buy}