


const aboutUs = async (bot) => {
    bot.onText(/\/aboutUs/, (msg) => {

        bot.sendMessage(msg.chat.id,
            `🙋‍♂️ Assalomu alaykum!
  
🎯 Maqsadimiz: foydali, oson va ishonchli xizmatni taqdim etish!
            
            ❤️ Biz siz uchun ishlaymiz!  
            🤝 Hamkorlikka doim ochiqmiz!
            
📣 Dasturimizda reklama joylashtirish, hamkorlik qilish yoki boshqa savollar yuzasidan biz bilan bogʻlanmoqchi boʻlsangiz, quyidagi manzil orqali murojaat qiling:

📲 Telegram: @ascoder_me
            
💡 Takliflaringizni doimo mamnuniyat bilan kutib qolamiz!
            
`);
    })

}

module.exports = aboutUs


