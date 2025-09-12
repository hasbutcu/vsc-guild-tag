module.exports = { // discord.gg/vsc ❤️ oxyinc
  name: 'ready',
  once: true,
  execute(client, db, logger, getCache, BaseEmbed, config, readyClient) {
    logger.success(`Bot başarıyla Discord'a giriş yaptı: ${readyClient.user.tag}`);
  },
};