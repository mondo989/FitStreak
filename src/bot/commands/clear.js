// src/bot/commands/clear.js

const firebaseService = require('../../services/firebaseService');

module.exports = async (ctx) => {
  const userId = ctx.from.id;
  const activity = ctx.message.text.split(' ')[1]; // The activity to clear

  // Clear the activity
  await firebaseService.clearActivity(userId, activity);

  ctx.reply(`Cleared ${activity} for today.`);
};
