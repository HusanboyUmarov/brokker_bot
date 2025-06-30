

const checkChannelSubscribe = async (bot, userId) => {
    try {
      const res = await bot.getChatMember(process.env?.CHANNEL_ID, userId);
      const status = res.status;

      if (['member', 'administrator', 'creator'].includes(status)) {
        return true; // Foydalanuvchi kanalga a'zo
      } else {
        return false; // Foydalanuvchi a'zo emas (left, kicked, restricted)
      }
    } catch (error) {
      console.error('Tekshiruvda xatolik:', error.response?.body || error.message);
      return false;
    }
  };

  module.exports = checkChannelSubscribe
  