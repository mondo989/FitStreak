// src/bot/commands/monthly.js
const firebaseService = require('../../services/firebaseService');
const { emojiForActivity } = require('../utils/emojiForActivity'); // Adjust the path as necessary

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  try {
    const { activitiesSummary, totalDaysTracked } = await firebaseService.getMonthlyActivitiesSummary(userId);

    let replyMessage = `Your Monthly Workouts!\n`;
    Object.entries(activitiesSummary).forEach(([activity, count]) => {
      replyMessage += `${count} ${activity} ${emojiForActivity(activity)}\n`;
    });
    replyMessage += `Days active this month: ${totalDaysTracked}\n\nGreat job!`;

    ctx.reply(replyMessage);
  } catch (error) {
    console.error("Error in /monthly command:", error);
    ctx.reply("An error occurred while fetching monthly activities.");
  }
};
