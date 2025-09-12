const { SlashCommandBuilder } = require('discord.js');

module.exports = { // discord.gg/vsc ❤️ oxyinc
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Botun ping değerini gösterir.'),
  
  async execute(interaction, client, db, logger, getCache, BaseEmbed, config) {
    const embed = BaseEmbed()
      .setTitle('🏓 Pong!')
      .setDescription(`**Bot Gecikmesi:** ${client.ws.ping}ms`)
      .setColor('#00ff00');
    
    await interaction.reply({ embeds: [embed] });
  },
};