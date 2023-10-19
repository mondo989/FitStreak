// src/bot/commands/today.js

const firebaseService = require('../../services/firebaseService');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  // Fetch today's activities
  const activities = await firebaseService.fetchTodayActivities(userId);

  ctx.reply(`Today's activities: ${activities.join(', ')}`);
};
