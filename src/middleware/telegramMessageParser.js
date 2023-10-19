// src/middleware/telegramMessageParser.js

module.exports = (ctx, next) => {
  const rawMessage = ctx.message.text || '';
  const parts = rawMessage.split(' ');
  ctx.state.command = parts[0].substring(1);
  ctx.state.params = parts.slice(1);
  return next();
};
