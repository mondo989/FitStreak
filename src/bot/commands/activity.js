// src/bot/commands/activity.js

module.exports = (bot) => {
  const {
    recordActivity,
    clearActivity,
    fetchTodayActivities
  } = require('../../services/firebaseService');

  const workoutMessages = {
    pushups: "pushups 💪",
    squats: "squats 🦵",
    dips: "dips 🏋️‍♂️",
    run: "miles 🏃‍♂️",
    curls: "curls 💪"
  };

  const workoutEmojis = {
    pushups: "💪",
    squats: "🦵",
    dips: "🏋️‍♂️",
    run: "🏃‍♂️",
    curls: "💪"
  };

  const emojiForActivity = (activity) => {
    const activityEmojiMap = {
      'pushups': '💪',
      'squats': '🦵',
      'dips': '🏋️‍♂️',
      'run': '🏃‍♂️',
      'weight': '⚖️'
      // Add more mappings as needed
    };
    return activityEmojiMap[activity] || '🤷‍♂️';
  };

  const handleWorkoutCommand = async (ctx, workoutType) => {
    const userId = ctx.from.id;
    const count = ctx.message.text.split(' ')[1];
    const newTotal = await recordActivity(userId, workoutType, count);
    ctx.reply(`Good work! You've logged ${newTotal} total ${workoutMessages[workoutType]} today.`);
  };

  bot.command(Object.keys(workoutMessages), (ctx) => {
    const workoutType = ctx.message.text.split(' ')[0].substring(1); // Remove the '/' from the command
    handleWorkoutCommand(ctx, workoutType);
  });

  // Record weight for the day
  bot.command('weight', async (ctx) => {
    const userId = ctx.from.id;
    const weight = ctx.message.text.split(' ')[1];
    const newTotalWeight = await recordActivity(userId, 'weight', weight);
    ctx.replyWithMarkdown(`Great! You've logged your weight of *${newTotalWeight} lbs* for today ⚖️.`);
  });

  // Clear a specific activity
  bot.command('clear', async (ctx) => {
    const userId = ctx.from.id;
    const activityToClear = ctx.message.text.split(' ')[1];

    if (!activityToClear) {
      return ctx.reply("Please specify an activity to clear. For example, /clear pushups.");
    }

    await clearActivity(userId, activityToClear);
    ctx.reply(`Successfully cleared ${activityToClear} for today.`);
  });

  // Function to get the current date in EST
  const getTodayInEST = () => {
    const currentDate = new Date();
    const offset = -4; // EST
    const estDate = new Date(currentDate.getTime() + offset * 3600 * 1000).toISOString().split('T')[0];
    return estDate;
  };

  bot.command(['stats', 'today'], async (ctx) => {
    const userId = ctx.from.id;
    const estDate = getTodayInEST();
    const activities = await fetchTodayActivities(userId, estDate);
    let workoutActivities = '';
    let weightActivity = '';

    Object.entries(activities).forEach(([activity, count]) => {
      if (count > 0) {
        if (activity === 'weight') {
          weightActivity = `⚖️ *${count}* lbs`;
        } else {
          workoutActivities += `${emojiForActivity(activity)} *${count}* ${activity}\n`;
        }
      }
    });

    let replyMessage = `Today's Date:  \n *📅 ${estDate}*\n----\n*Workouts*\n${workoutActivities}----\n`;
    if (weightActivity) {
      replyMessage += `*Weight:*\n${weightActivity}`;
    } else if (!workoutActivities) {
      replyMessage = `Today's Date:  \n *📅 ${estDate}*\n----\n👟 No workouts yet, time to get moving!`;
    }

    ctx.replyWithMarkdown(replyMessage);
  });
};
