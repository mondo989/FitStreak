// src/bot/index.js

const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

// Importing command handlers here, ensure that bot is passed as an argument
require('./commands/activity')(bot);

// Command Handlers
bot.command('start', (ctx) => {
  ctx.reply('Ok, I’m ready to track your pushups & weight.');
});

module.exports = bot;
