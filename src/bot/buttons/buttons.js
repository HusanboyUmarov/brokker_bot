// Sotib olish yoki sotish
const orderType = {
    reply_markup: {
        keyboard: [
            ["/sell", "/buy"],
        ],
        resize_keyboard: true, // Tugmalar o'lchamini moslash
        one_time_keyboard: true, // Tugmalar bir martalik bo'lishi uchun
    }
};


const sellProducts = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "📱 Telefon", callback_data: "📱 Telefon" }],
            [{ text: "💻 Kompyuter", callback_data: "💻 Kompyuter" }],
            [{ text: "🖨 Kompyuter qurilmasi", callback_data: "🖨 Kompyuter qurilmasi" }],
            [{ text: "♻️ boshqalar", callback_data: "♻️ boshqalar" }]
        ],
        remove_keyboard: true
    }
};

const buyProducts = {
    reply_markup: {
        inline_keyboard: [
            [{ text: "📱 Telefon", callback_data: "📱 Telefon 📱" }],
            [{ text: "💻 Kompyuter", callback_data: "💻 Kompyuter 💻" }],
            [{ text: "🖨 Kompyuter qurilmasi", callback_data: "🖨 Kompyuter qurilmasi 🖨" }],
            [{ text: "♻️ boshqalar", callback_data: "♻️ boshqalar ♻️" }]
        ],
        remove_keyboard: true
    }
};

module.exports = {
    orderType,
    sellProducts,
    buyProducts
}