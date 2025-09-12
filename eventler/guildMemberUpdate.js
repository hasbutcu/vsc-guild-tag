const { 
  Colors, 
  userMention
} = require('discord.js');

module.exports = { // discord.gg/vsc ❤️ oxyinc
  name: 'raw',
  once: false,
  async execute(client, db, logger, getCache, BaseEmbed, config, pkg) {
    if (pkg.t !== 'GUILD_MEMBER_UPDATE') return;
    if (pkg.d.user?.primary_guild?.badge?.identity_enabled === false) {
      return db.set('base', {});
    }

    let guild, channel, role, member;

    try {
      guild = getCache({
        cacheType: 'Guild',
        id: config.guild.id,
      });
      
      channel = getCache({
        cacheType: 'Channel',
        id: config.guild.channel,
        guild,
      });
      
      role = getCache({
        cacheType: 'Role',
        id: config.guild.role,
        guild,
      });
      
      try {
        member = guild.members.cache.get(pkg.d.user?.id);
        if (!member) {
          member = await guild.members.fetch(pkg.d.user?.id);
        }
      } catch (error) {
        logger.error(`Member bulunamadı: ${pkg.d.user?.id} - ${error.message}`);
        return;
      }
      
    } catch (error) {
      logger.error('Cache yüklenemedi: ' + error.message);
      return;
    }

    const guildId = pkg.d.user?.primary_guild?.identity_guild_id;
    const badgeImage = `https://cdn.discordapp.com/clan-badges/${guild?.id}/${pkg.d.user?.primary_guild?.badge}.png?size=4096`;

    if (guildId === config.guild.id) {
      if (db.has(`base.${member?.id}`)) return;
      
      db.set(`base.${member?.id}`, Date.now());
      member?.roles.add(role?.id || '');
      
      try {
        await channel?.send({
          content: userMention(member?.id ?? ""),
          embeds: [
            BaseEmbed()
              .setAuthor({
                name: `Hoşgeldin ${member?.user.displayName}!`,
                iconURL: member?.displayAvatarURL(),
              })
              .setTitle("Bizi Desteklediğin İçin Teşekkürler!")
              .setThumbnail(badgeImage)
              .setDescription(
                "> Sunucumuzun etiketini (tag'ini)  aldığın için teşekkürler! Artık topluluğumuzu temsil ediyorsun. Bu etiketi taşıdığın sürece bu özel role sahip olacaksın."
              ),
          ],
        });
      } catch (error) {
        logger.error(`Hoşgeldin mesajı gönderilirken hata: ${error.message}`);
      }
      
    } else {
      if (!db.has(`base.${member?.id}`)) return;
      
      db.delete(`base.${member?.id}`);
      member?.roles.remove(role?.id || '');
      
      try {
        await channel?.send({
          embeds: [
            BaseEmbed()
              .setColor(Colors.Red)
              .setAuthor({
                name: `Görüşürüz ${member?.user.displayName}!`,
                iconURL: member?.displayAvatarURL(),
              })
              .setTitle("Seni Özleyeceğiz.")
              .setDescription(
                "> Sunucu etiketini ismindeki kaldırdığın için temsilci rolün de kaldırıldı. Yeniden topluluğu temsil etmek istersen, etiketi ismine eklemen yeterli!"
              )
              .setThumbnail(badgeImage),
          ],
        });
      } catch (error) {
        logger.error(`Veda mesajı gönderilirken hata: ${error.message}`);
      }
    }
  },
};