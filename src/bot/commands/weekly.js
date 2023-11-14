// src/bot/commands/weekly.js
const firebaseService = require('../../services/firebaseService');
const { emojiForActivity } = require('../utils/emojiForActivity'); // Adjust the path as necessary

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  try {
    const { activitiesSummary, totalDaysTracked } = await firebaseService.getWeeklyActivitiesSummary(userId);

    let replyMessage = `Your Weekly Workouts!\n`;
    Object.entries(activitiesSummary).forEach(([activity, count]) => {
      replyMessage += `${count} ${activity} ${emojiForActivity(activity)}\n`;
    });
    replyMessage += `Days active this week: ${totalDaysTracked}\n\nKeep it up!`;

    ctx.reply(replyMessage);
  } catch (error) {
    console.error("Error in /weekly command:", error);
    ctx.reply("An error occurred while fetching weekly activities.");
  }
};
