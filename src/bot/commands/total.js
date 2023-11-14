// src/bot/commands/total.js
const firebaseService = require('../../services/firebaseService');

module.exports = async (ctx) => {
  const userId = ctx.from.id;

  // Fetch detailed summary of activities
  const { activitiesSummary, totalDaysTracked } = await firebaseService.getTotalActivitiesSummary(userId);

  let replyMessage = `Your Total Tracked Workouts!\n`;
  Object.entries(activitiesSummary).forEach(([activity, count]) => {
    replyMessage += `${count} ${activity} ${emojiForActivity(activity)}\n`; // Make sure emojiForActivity function is available or defined
  });
  replyMessage += `Total days tracked: ${totalDaysTracked}\n\nKeep going!`;

  ctx.reply(replyMessage);
};
