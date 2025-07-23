const checkChannelSubscribe = require("../../middlewares/checkSubscribe.middleware");

const userDevices = {}; // Global user data saqlash
const sellQuery = (bot) => {
    bot.on("callback_query", async (callback) => {
        const action = callback.data;
        const chatId = callback.from.id;

        const data = callback.data;
        const adminChatId = callback.message.chat.id;

        
        try {
            const result = await checkChannelSubscribe(bot, chatId)

            if(!result){
               return bot.sendMessage(chatId, `Iltimos botdan to'liq foydalanish uchun kanalga a'zo bo'ling:
https://t.me/techBozor_Official
                `,
                {
                    disable_web_page_preview: true
                })
            }


        } catch (error) {
            console.log(error.message)
        }


        if (data.startsWith('confirm_')) {
            const userId = data.split('_')[1];
            if (userDevices[userId]) {
                await bot.sendMediaGroup(process.env.CHANNEL_ID, userDevices[userId].images);
                await bot.sendMessage(adminChatId, "✅ E'lon kanalga chiqarildi!");
                await bot.sendMessage(userId, "✅ E'loningiz kanalga chiqdi! Rahmat.Yangi e'lon uchun /start ni bosing");
                delete userDevices[userId];
            }
        } else if (data.startsWith('reject_')) {
            const userId = data.split('_')[1];

            if (userDevices[userId]) {
                await bot.sendMessage(adminChatId, "❌ E'lon bekor qilindi.");
                await bot.sendMessage(userId, `❌ E'lon bekor qilindi.
        🔑 E'loningiz chiqishi uchun quydagilarga etibor bering:
✅ Imlo xatolardan qoching,
✅ Imkon qadar barcha ma'lumotlarni to'ldiring,
✅ Rasmlarni sifatiga e'tibor bering
                        
Yangi e'lon yaratish uchun /start buyrug‘ini bosing.`);
                delete userDevices[userId];
            }
        }

        bot.answerCallbackQuery(callback.id);

        if (action === "📱 Telefon") {
            userDevices[chatId] = { step: "brend" };
            bot.sendMessage(chatId, "📲 Brend nomini kiriting (masalan, iPhone, Samsung):");
        }

        if (action === "💻 Kompyuter") {
            userDevices[chatId] = { step: "lap_brend" };
            bot.sendMessage(chatId, "💻 Brend nomini kiriting (masalan, Acer, Asus):");
        }

        if (action === "🖨 Kompyuter qurilmasi") {
            userDevices[chatId] = { step: "hardware_name" };
            bot.sendMessage(chatId, "🖨 Qrulma nomini kiriting (masalan, Printer, monitor):");
        }

        if (action === "♻️ boshqalar") {
            userDevices[chatId] = { step: "other_name" };
            bot.sendMessage(chatId, "♻️ Qrulma nomini kiriting (masalan, smartwatch)");
        }
    });

    // Phone Forma
    bot.on("message", async (msg) => {
        try {
            const chatId = msg.chat.id;
            const text = msg.text;


            if (!userDevices[chatId]) return;

            const step = userDevices[chatId].step;

            if (step === "brend") {
                userDevices[chatId].brend = text;
                userDevices[chatId].step = "model";
                bot.sendMessage(chatId, "📱 Model nomini kiriting (masalan, Galaxy Note10+ 5G)");
            } else if (step === "model") {
                userDevices[chatId].model = text;
                userDevices[chatId].step = "ram";
                bot.sendMessage(chatId, "💾 RAM hajmini kiriting (masalan, 8GB)");
            } else if (step === "ram") {
                userDevices[chatId].ram = text;
                userDevices[chatId].step = "sum";
                bot.sendMessage(chatId, "💰 Summani kiriting (masalan, $100)");
            } else if (step === "sum") {
                userDevices[chatId].sum = text;
                userDevices[chatId].step = "qoshimcha";
                bot.sendMessage(chatId, "📃 Qo‘shimcha ma'lumot bo‘lsa yozing:");
            } else if (step === "qoshimcha") {
                userDevices[chatId].qoshimcha = text;
                userDevices[chatId].step = "phone";
                bot.sendMessage(chatId, "📞 Aloqa uchun telefon raqamni kiriting (masalan, +998901234567)");
            } else if (step === "phone") {
                userDevices[chatId].phone = text;
                userDevices[chatId].step = "location";
                bot.sendMessage(chatId, "📍 Yashash joyingizni kiriting (masalan, Farg‘ona)");
            } else if (step === "location") {
                userDevices[chatId].location = text;
                userDevices[chatId].step = "image";
                bot.sendMessage(chatId, "🖼 Sotilayotgan mahsulot rasmlarini yuboring:");
            } else if (step === "image" && msg.photo) {
                const mediaGroupId = msg.media_group_id;

                if (!userDevices[chatId].images) {
                    userDevices[chatId].images = [];
                }

                if (mediaGroupId) {
                    if (!userDevices[chatId].currentMediaGroup || userDevices[chatId].currentMediaGroup !== mediaGroupId) {
                        userDevices[chatId].currentMediaGroup = mediaGroupId;
                        userDevices[chatId].images = [];
                    }

                    userDevices[chatId].images.push({
                        type: "photo",
                        media: msg.photo.pop().file_id,
                    });

                    // Oldingi vaqtni bekor qilib, yangi taymer qo‘yamiz
                    if (userDevices[chatId].timeout) {
                        clearTimeout(userDevices[chatId].timeout);
                    }

                    userDevices[chatId].timeout = setTimeout(async () => {
                        if (userDevices[chatId].images.length > 0) {
                            userDevices[chatId].images[0].caption = `🟢 Sotiladi
    
📲 Brend: ${userDevices[chatId].brend} 
📱 Model: ${userDevices[chatId].model} 
💾 RAM: ${userDevices[chatId].ram} 
💰 Summa: ${userDevices[chatId].sum} 
📍 Manzil: ${userDevices[chatId].location} 
📞 Aloqa: ${userDevices[chatId].phone} 
🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" } 
📃 Qoshimcha: ${userDevices[chatId].qoshimcha} 
    
    #sell #${userDevices[chatId].brend} #telefon`;

                            try {
                                await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                                await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                                    reply_markup: {
                                        keyboard: [
                                            ["✅ Tasdiqlash", "❌ Rad etish"]
                                        ],
                                        resize_keyboard: true,
                                        one_time_keyboard: true
                                    }
                                });

                                userDevices[chatId].step = "confirm";
                            } catch (error) {
                                console.error("Rasm yuborishda xatolik:", error);
                            }
                        }
                    }, 1500);

                    return;
                }

                // Agar bitta rasm bo‘lsa, darhol jo‘natamiz
                userDevices[chatId].images = [{
                    type: "photo",
                    media: msg.photo.pop().file_id
                }];

                userDevices[chatId].images[0].caption = `🟢 Sotiladi
    
📲 Brend: ${userDevices[chatId].brend} 
📱 Model: ${userDevices[chatId].model} 
💾 RAM: ${userDevices[chatId].ram} 
💰 Summa: ${userDevices[chatId].sum} 
📍 Manzil: ${userDevices[chatId].location} 
📞 Aloqa: ${userDevices[chatId].phone} 
🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" }
📃 Qoshimcha: ${userDevices[chatId].qoshimcha} 
    
    #sell #${userDevices[chatId].brend}, #telefon`;

                try {
                    await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                    await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                        reply_markup: {
                            keyboard: [
                                ["✅ Tasdiqlash", "❌ Rad etish"]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });

                    userDevices[chatId].step = "confirm";
                } catch (error) {
                    console.error("Rasm yuborishda xatolik:", error);
                }
            } else if (step === "confirm") {
                if (text === "✅ Tasdiqlash") {
                    // USER tasdiqlasa, ADMINLAR guruhiga yuboramiz
                    const adminMessage = await bot.sendMediaGroup(process.env.ADMIN_GROUP_ID, userDevices[chatId].images);

                    // Keyin adminlarga alohida tasdiqlash uchun tugmalar yuboramiz
                    const adminMsg = await bot.sendMessage(process.env.ADMIN_GROUP_ID, "🆕 Yangi e'lon! Tasdiqlaysizmi?", {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "✅ Kanalga chiqarish", callback_data: `confirm_${chatId}` },
                                    { text: "❌ Bekor qilish", callback_data: `reject_${chatId}` }
                                ]
                            ]
                        }
                    });

                    // Admin uchun xabar ID saqlab qo'yamiz, kerak bo'lishi mumkin
                    userDevices[chatId].adminMessageId = adminMsg.message_id;

                    bot.sendMessage(chatId, "✅ E'lon adminlarga yuborildi. Tasdiqlanishini kuting.");
                    userDevices[chatId].step = "waiting_admin";
                } else if (text === "❌ Rad etish") {
                    bot.sendMessage(chatId, "❌ E'lon bekor qilindi. Yangi e'lon yaratish uchun /sell buyrug‘ini bosing.");
                    delete userDevices[chatId];
                }
            }

        } catch (error) {
            console.log(error)
        }
    });

    // Laptop Forma
    bot.on("message", async (msg) => {
        try {
            const chatId = msg.chat.id;
            const text = msg.text;

            if (!userDevices[chatId]) return;

            const step = userDevices[chatId].step;

            if (step === "lap_brend") {
                userDevices[chatId].lap_brend = text;
                userDevices[chatId].step = "lap_cpu";
                bot.sendMessage(chatId, "🔲 CPU misol: Core I7 10750H 6 Yader 12 Potok (2.60Ghz-4.50Ghz)");
            } else if (step === "lap_cpu") {
                userDevices[chatId].lap_cpu = text;
                userDevices[chatId].step = "lap_ram";
                bot.sendMessage(chatId, "💾 RAM hajmini kiriting (masalan, DDR4 16GB)");
            } else if (step === "lap_ram") {
                userDevices[chatId].lap_ram = text;
                userDevices[chatId].step = "lap_sum";
                bot.sendMessage(chatId, "💰 Summani kiriting (masalan, $300)");
            } else if (step === "lap_sum") {
                userDevices[chatId].lap_sum = text;
                userDevices[chatId].step = "lap_qoshimcha";
                bot.sendMessage(chatId, "📃 Qo‘shimcha ma'lumot bo‘lsa yozing:");
            } else if (step === "lap_qoshimcha") {
                userDevices[chatId].lap_qoshimcha = text;
                userDevices[chatId].step = "lap_phone";
                bot.sendMessage(chatId, "📞 Aloqa uchun telefon raqamni kiriting (masalan, +998901234567)");
            } else if (step === "lap_phone") {
                userDevices[chatId].lap_phone = text;
                userDevices[chatId].step = "lap_location";
                bot.sendMessage(chatId, "📍 Yashash joyingizni kiriting (masalan, Farg‘ona)");
            } else if (step === "lap_location") {
                userDevices[chatId].lap_location = text;
                userDevices[chatId].step = "lap_image";
                bot.sendMessage(chatId, "🖼 Sotilayotgan mahsulot rasmlarini yuboring:");
            } else if (step === "lap_image" && msg.photo) {
                const mediaGroupId = msg.media_group_id;

                if (!userDevices[chatId].images) {
                    userDevices[chatId].images = [];
                }

                if (mediaGroupId) {
                    if (!userDevices[chatId].currentMediaGroup || userDevices[chatId].currentMediaGroup !== mediaGroupId) {
                        userDevices[chatId].currentMediaGroup = mediaGroupId;
                        userDevices[chatId].images = [];
                    }

                    userDevices[chatId].images.push({
                        type: "photo",
                        media: msg.photo.pop().file_id,
                    });

                    // Oldingi vaqtni bekor qilib, yangi taymer qo‘yamiz
                    if (userDevices[chatId].timeout) {
                        clearTimeout(userDevices[chatId].timeout);
                    }

                    userDevices[chatId].timeout = setTimeout(async () => {
                        if (userDevices[chatId].images.length > 0) {
                            userDevices[chatId].images[0].caption = `🟢 Sotiladi
    💻 Brend: ${userDevices[chatId].lap_brend} 
    💻 Model: ${userDevices[chatId].lap_cpu} 
    💾 RAM: ${userDevices[chatId].lap_ram} 
    💰 Summa: ${userDevices[chatId].lap_sum} 
    📍 Manzil: ${userDevices[chatId].lap_location} 
    📞 Aloqa: ${userDevices[chatId].lap_phone} 
    🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" }
    📃 Qoshimcha: ${userDevices[chatId].lap_qoshimcha} 
    
    #sell #${userDevices[chatId].lap_brend}`;

                            try {
                                await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                                await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                                    reply_markup: {
                                        keyboard: [
                                            ["✅ Tasdiqlash", "❌ Rad etish"]
                                        ],
                                        resize_keyboard: true,
                                        one_time_keyboard: true
                                    }
                                });

                                userDevices[chatId].step = "lap_confirm";
                            } catch (error) {
                                console.error("Rasm yuborishda xatolik:", error);
                            }
                        }
                    }, 1500);

                    return;
                }

                // Agar bitta rasm bo‘lsa, darhol jo‘natamiz
                userDevices[chatId].images = [{
                    type: "photo",
                    media: msg.photo.pop().file_id
                }];

                userDevices[chatId].images[0].caption = `🟢 Sotiladi
    
💻 Brend: ${userDevices[chatId].lap_brend} 
💻 Model: ${userDevices[chatId].lap_cpu} 
💾 RAM: ${userDevices[chatId].lap_ram} 
💰 Summa: ${userDevices[chatId].lap_sum} 
📍 Manzil: ${userDevices[chatId].lap_location} 
📞 Aloqa: ${userDevices[chatId].lap_phone} 
🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" }
📃 Qoshimcha: ${userDevices[chatId].lap_qoshimcha} 
                
    #sell #${userDevices[chatId].lep_brend}`;

                try {
                    await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                    await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                        reply_markup: {
                            keyboard: [
                                ["✅ Tasdiqlash", "❌ Rad etish"]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });

                    userDevices[chatId].step = "lap_confirm";
                } catch (error) {
                    console.error("Rasm yuborishda xatolik:", error);
                }
            } else if (step === "lap_confirm") {
                if (text === "✅ Tasdiqlash") {
                    // USER tasdiqlasa, ADMINLAR guruhiga yuboramiz
                    const adminMessage = await bot.sendMediaGroup(process.env.ADMIN_GROUP_ID, userDevices[chatId].images);

                    // Keyin adminlarga alohida tasdiqlash uchun tugmalar yuboramiz
                    const adminMsg = await bot.sendMessage(process.env.ADMIN_GROUP_ID, "🆕 Yangi e'lon! Tasdiqlaysizmi?", {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "✅ Kanalga chiqarish", callback_data: `confirm_${chatId}` },
                                    { text: "❌ Bekor qilish", callback_data: `reject_${chatId}` }
                                ]
                            ]
                        }
                    });

                    // Admin uchun xabar ID saqlab qo'yamiz, kerak bo'lishi mumkin
                    userDevices[chatId].adminMessageId = adminMsg.message_id;

                    bot.sendMessage(chatId, "✅ E'lon adminlarga yuborildi. Tasdiqlanishini kuting.");
                    userDevices[chatId].step = "waiting_admin";
                } else if (text === "❌ Rad etish") {
                    bot.sendMessage(chatId, "❌ E'lon bekor qilindi. Yangi e'lon yaratish uchun /sell buyrug‘ini bosing.");
                    delete userDevices[chatId];
                }

            }
        } catch (error) {
            console.log(error)
        }
    });

    // hardware Forma
    bot.on("message", async (msg) => {
        try {
            const chatId = msg.chat.id;
            const text = msg.text;

            if (!userDevices[chatId]) return;

            const step = userDevices[chatId].step;

            if (step === "hardware_name") {
                userDevices[chatId].hardware_name = text;
                userDevices[chatId].step = "hardware_condition";
                bot.sendMessage(chatId, "📊 Qrulma holati haqida ma'lumot (masalan, yangi, ideal, eski)");
            } else if (step === "hardware_condition") {
                userDevices[chatId].hardware_condition = text;
                userDevices[chatId].step = "hardware_box";
                bot.sendMessage(chatId, "📦 karobka dakumenti bormi? (masalan, bor, yoq)");
            } else if (step === "hardware_box") {
                userDevices[chatId].hardware_box = text;
                userDevices[chatId].step = "hardware_sum";
                bot.sendMessage(chatId, "💰 Summani kiriting (masalan, $300)");
            } else if (step === "hardware_sum") {
                userDevices[chatId].hardware_sum = text;
                userDevices[chatId].step = "hardware_qoshimcha";
                bot.sendMessage(chatId, "📃 Qo‘shimcha ma'lumot bo‘lsa yozing:");
            } else if (step === "hardware_qoshimcha") {
                userDevices[chatId].hardware_qoshimcha = text;
                userDevices[chatId].step = "hardware_phone";
                bot.sendMessage(chatId, "📞 Aloqa uchun telefon raqamni kiriting (masalan, +998901234567)");
            } else if (step === "hardware_phone") {
                userDevices[chatId].hardware_phone = text;
                userDevices[chatId].step = "hardware_location";
                bot.sendMessage(chatId, "📍 Yashash joyingizni kiriting (masalan, Farg‘ona)");
            } else if (step === "hardware_location") {
                userDevices[chatId].hardware_location = text;
                userDevices[chatId].step = "hardware_image";
                bot.sendMessage(chatId, "🖼 Sotilayotgan mahsulot rasmlarini yuboring:");
            } else if (step === "hardware_image" && msg.photo) {
                const mediaGroupId = msg.media_group_id;

                if (!userDevices[chatId].images) {
                    userDevices[chatId].images = [];
                }

                if (mediaGroupId) {
                    if (!userDevices[chatId].currentMediaGroup || userDevices[chatId].currentMediaGroup !== mediaGroupId) {
                        userDevices[chatId].currentMediaGroup = mediaGroupId;
                        userDevices[chatId].images = [];
                    }

                    userDevices[chatId].images.push({
                        type: "photo",
                        media: msg.photo.pop().file_id,
                    });

                    // Oldingi vaqtni bekor qilib, yangi taymer qo‘yamiz
                    if (userDevices[chatId].timeout) {
                        clearTimeout(userDevices[chatId].timeout);
                    }

                    userDevices[chatId].timeout = setTimeout(async () => {
                        if (userDevices[chatId].images.length > 0) {
                            userDevices[chatId].images[0].caption = `🟢 Sotiladi
    
🖨 Qurulma nomi: ${userDevices[chatId].hardware_name} 
📊 Holati: ${userDevices[chatId].hardware_condition} 
📦 Karobkasi: ${userDevices[chatId].hardware_box} 
💰 Summa: ${userDevices[chatId].hardware_sum} 
📍 Manzil: ${userDevices[chatId].hardware_location} 
📞 Aloqa: ${userDevices[chatId].hardware_phone} 
🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" }
📃 Qoshimcha: ${userDevices[chatId].hardware_qoshimcha} 
    
    #sell #${userDevices[chatId].hardware_name}`;

                            try {
                                await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                                await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                                    reply_markup: {
                                        keyboard: [
                                            ["✅ Tasdiqlash", "❌ Rad etish"]
                                        ],
                                        resize_keyboard: true,
                                        one_time_keyboard: true
                                    }
                                });

                                userDevices[chatId].step = "hardware_confirm";
                            } catch (error) {
                                console.error("Rasm yuborishda xatolik:", error);
                            }
                        }
                    }, 1500);

                    return;
                }

                // Agar bitta rasm bo‘lsa, darhol jo‘natamiz
                userDevices[chatId].images = [{
                    type: "photo",
                    media: msg.photo.pop().file_id
                }];

                userDevices[chatId].images[0].caption = `🟢 Sotiladi
    
🖨 Qurulma nomi: ${userDevices[chatId].hardware_name} 
📊 Holati: ${userDevices[chatId].hardware_condition} 
📦 Karobkasi: ${userDevices[chatId].hardware_box} 
💰 Summa: ${userDevices[chatId].hardware_sum} 
📍 Manzil: ${userDevices[chatId].hardware_location} 
📞 Aloqa: ${userDevices[chatId].hardware_phone} 
🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" }
📃 Qoshimcha: ${userDevices[chatId].hardware_qoshimcha} 
                
    #sell #${userDevices[chatId].hardware_name}`;

                try {
                    await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                    await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                        reply_markup: {
                            keyboard: [
                                ["✅ Tasdiqlash", "❌ Rad etish"]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });

                    userDevices[chatId].step = "hardware_confirm";
                } catch (error) {
                    console.error("Rasm yuborishda xatolik:", error);
                }
            } else if (step === "hardware_confirm") {
                if (text === "✅ Tasdiqlash") {
                    // USER tasdiqlasa, ADMINLAR guruhiga yuboramiz
                    const adminMessage = await bot.sendMediaGroup(process.env.ADMIN_GROUP_ID, userDevices[chatId].images);

                    // Keyin adminlarga alohida tasdiqlash uchun tugmalar yuboramiz
                    const adminMsg = await bot.sendMessage(process.env.ADMIN_GROUP_ID, "🆕 Yangi e'lon! Tasdiqlaysizmi?", {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "✅ Kanalga chiqarish", callback_data: `confirm_${chatId}` },
                                    { text: "❌ Bekor qilish", callback_data: `reject_${chatId}` }
                                ]
                            ]
                        }
                    });

                    // Admin uchun xabar ID saqlab qo'yamiz, kerak bo'lishi mumkin
                    userDevices[chatId].adminMessageId = adminMsg.message_id;

                    bot.sendMessage(chatId, "✅ E'lon adminlarga yuborildi. Tasdiqlanishini kuting.");
                    userDevices[chatId].step = "waiting_admin";
                } else if (text === "❌ Rad etish") {
                    bot.sendMessage(chatId, "❌ E'lon bekor qilindi. Yangi e'lon yaratish uchun /sell buyrug‘ini bosing.");
                    delete userDevices[chatId];
                }
            }
        } catch (error) {
            console.log(error)
        }
    });

    // others Forma
    bot.on("message", async (msg) => {
        try {
            const chatId = msg.chat.id;
            const text = msg.text;

            if (!userDevices[chatId]) return;

            const step = userDevices[chatId].step;

            if (step === "other_name") {
                userDevices[chatId].other_name = text;
                userDevices[chatId].step = "other_condition";
                bot.sendMessage(chatId, "📊 Qrulma holati haqida ma'lumot (masalan, yangi, ideal, eski)");
            } else if (step === "other_condition") {
                userDevices[chatId].other_condition = text;
                userDevices[chatId].step = "other_box";
                bot.sendMessage(chatId, "📦 karobka dakumenti bormi? (masalan, bor, yoq)");
            } else if (step === "other_box") {
                userDevices[chatId].other_box = text;
                userDevices[chatId].step = "other_sum";
                bot.sendMessage(chatId, "💰 Summani kiriting (masalan, $300)");
            } else if (step === "other_sum") {
                userDevices[chatId].other_sum = text;
                userDevices[chatId].step = "other_qoshimcha";
                bot.sendMessage(chatId, "📃 Qo‘shimcha ma'lumot bo‘lsa yozing:");
            } else if (step === "other_qoshimcha") {
                userDevices[chatId].other_qoshimcha = text;
                userDevices[chatId].step = "other_phone";
                bot.sendMessage(chatId, "📞 Aloqa uchun telefon raqamni kiriting (masalan, +998901234567)");
            } else if (step === "other_phone") {
                userDevices[chatId].other_phone = text;
                userDevices[chatId].step = "other_adress";
                bot.sendMessage(chatId, "📍 Yashash joyingizni kiriting (masalan, Farg‘ona)");
            } else if (step === "other_adress") {
                userDevices[chatId].other_adress = text;
                userDevices[chatId].step = "other_image";
                bot.sendMessage(chatId, "🖼 Sotilayotgan mahsulot rasmlarini yuboring:");
            } else if (step === "other_image" && msg.photo) {
                const mediaGroupId = msg.media_group_id;

                if (!userDevices[chatId].images) {
                    userDevices[chatId].images = [];
                }

                if (mediaGroupId) {
                    if (!userDevices[chatId].currentMediaGroup || userDevices[chatId].currentMediaGroup !== mediaGroupId) {
                        userDevices[chatId].currentMediaGroup = mediaGroupId;
                        userDevices[chatId].images = [];
                    }

                    userDevices[chatId].images.push({
                        type: "photo",
                        media: msg.photo.pop().file_id,
                    });

                    // Oldingi vaqtni bekor qilib, yangi taymer qo‘yamiz
                    if (userDevices[chatId].timeout) {
                        clearTimeout(userDevices[chatId].timeout);
                    }

                    userDevices[chatId].timeout = setTimeout(async () => {
                        if (userDevices[chatId].images.length > 0) {
                            userDevices[chatId].images[0].caption = `🟢 Sotiladi
    🖨 Qurulma nomi: ${userDevices[chatId].other_name}
    📊 Holati: ${userDevices[chatId].other_condition}
    📦 Karobkasi: ${userDevices[chatId].other_box}
    💰 Summa: ${userDevices[chatId].other_sum}
    📍 Manzil: ${userDevices[chatId].other_adress}
    📞 Aloqa: ${userDevices[chatId].other_phone}
    🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" }
    📃 Qoshimcha: ${userDevices[chatId].other_qoshimcha} 
        
        #sell #${userDevices[chatId].other_name}`;

                            try {
                                await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                                await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                                    reply_markup: {
                                        keyboard: [
                                            ["✅ Tasdiqlash", "❌ Rad etish"]
                                        ],
                                        resize_keyboard: true,
                                        one_time_keyboard: true
                                    }
                                });

                                userDevices[chatId].step = "other_confirm";
                            } catch (error) {
                                console.error("Rasm yuborishda xatolik:", error);
                            }
                        }
                    }, 1500);

                    return;
                }

                // Agar bitta rasm bo‘lsa, darhol jo‘natamiz
                userDevices[chatId].images = [{
                    type: "photo",
                    media: msg.photo.pop().file_id
                }];

                userDevices[chatId].images[0].caption = `🟢 Sotiladi
        
🖨 Qurulma nomi: ${userDevices[chatId].other_name} 
📊 Holati: ${userDevices[chatId].other_condition} 
📦 Karobkasi: ${userDevices[chatId].other_box} 
💰 Summa: ${userDevices[chatId].other_sum} 
📍 Manzil: ${userDevices[chatId].other_adress} 
📞 Aloqa: ${userDevices[chatId].other_phone} 
🇺🇿 Telegram: ${msg.from?.username ? "@"+msg.from.username : "mavjud emas" }
📃 Qoshimcha: ${userDevices[chatId].other_qoshimcha} 
                    
        #sell #${userDevices[chatId].other_name}`;

                try {
                    await bot.sendMediaGroup(chatId, userDevices[chatId].images);

                    await bot.sendMessage(chatId, "📢 E'loningizni tasdiqlang yoki bekor qiling:", {
                        reply_markup: {
                            keyboard: [
                                ["✅ Tasdiqlash", "❌ Rad etish"]
                            ],
                            resize_keyboard: true,
                            one_time_keyboard: true
                        }
                    });

                    userDevices[chatId].step = "other_confirm";
                } catch (error) {
                    console.error("Rasm yuborishda xatolik:", error);
                }
            } else if (step === "other_confirm") {
                if (text === "✅ Tasdiqlash") {
                    // USER tasdiqlasa, ADMINLAR guruhiga yuboramiz
                    const adminMessage = await bot.sendMediaGroup(process.env.ADMIN_GROUP_ID, userDevices[chatId].images);

                    // Keyin adminlarga alohida tasdiqlash uchun tugmalar yuboramiz
                    const adminMsg = await bot.sendMessage(process.env.ADMIN_GROUP_ID, "🆕 Yangi e'lon! Tasdiqlaysizmi?", {
                        reply_markup: {
                            inline_keyboard: [
                                [
                                    { text: "✅ Kanalga chiqarish", callback_data: `confirm_${chatId}` },
                                    { text: "❌ Bekor qilish", callback_data: `reject_${chatId}` }
                                ]
                            ]
                        }
                    });

                    // Admin uchun xabar ID saqlab qo'yamiz, kerak bo'lishi mumkin
                    userDevices[chatId].adminMessageId = adminMsg.message_id;

                    bot.sendMessage(chatId, "✅ E'lon adminlarga yuborildi. Tasdiqlanishini kuting.");
                    userDevices[chatId].step = "waiting_admin";
                } else if (text === "❌ Rad etish") {
                    bot.sendMessage(chatId, "❌ E'lon bekor qilindi. Yangi e'lon yaratish uchun /sell buyrug‘ini bosing.");
                    delete userDevices[chatId];
                }
            }
        } catch (error) {
            console.log(error)
        }
    });
};






module.exports = { sellQuery }