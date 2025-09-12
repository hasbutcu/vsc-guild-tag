const { Client, GatewayIntentBits, Collection, EmbedBuilder, REST, Routes } = require('discord.js');
const db = require('croxydb');
const fs = require('fs');
const path = require('path');
const config = require('./config.js');

const { TextDisplayBuilder } = require('discord.js');
console.log(typeof TextDisplayBuilder);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const logger = {
  success: (message) => console.log(`✅ ${message}`),
  error: (message) => console.log(`❌ ${message}`),
  info: (message) => console.log(`ℹ️ ${message}`),
  warn: (message) => console.log(`⚠️ ${message}`)
};

const CacheType = {
  Guild: () => client.guilds.cache,
  Channel: (guild) => guild?.channels?.cache,
  Role: (guild) => guild?.roles?.cache,
  User: () => client.users.cache,
  Member: (guild) => guild?.members.cache,
};

function getCache({ cacheType, id, guild }) { // discord.gg/vsc ❤️ oxyinc
  if (!id) {
    const message = `Beklenen "${cacheType}" ID değeri sağlanmadı.`;
    logger.error(message);
    throw new Error(message);
  }
  
  const selector = CacheType[cacheType];
  if (!selector) {
    const message = `Cache tipi hatası: "${cacheType}". Desteklenen tipler: Guild, Channel, Role, User, Member.`;
    logger.error(message);
    throw new Error(message);
  }
  
  const cache = selector(guild);
  if (!cache) {
    const message = `Cache "${cacheType}" için erişilemedi. ${cacheType !== "Guild" ? "Muhtemelen 'guild' nesnesi geçersiz veya tanımsız." : ""}`;
    logger.error(message);
    throw new Error(message);
  }
  
  const item = cache.get(id);
  if (!item) {
    if (cacheType === "Member") {
      const message = `Member cache'de bulunamadı: ${id}`;
      logger.warn(message); 
      throw new Error(message);
    }
    
    const message = `"${cacheType}" bulunamadı. Sağlanan ID: "${id}". Nesne önbelleğe alınmamış olabilir veya geçersiz bir ID girilmiş olabilir.`;
    logger.error(message);
    throw new Error(message);
  }
  
  return item;
}

function BaseEmbed() {
  return new EmbedBuilder()
    .setColor('#0099ff')
    .setTimestamp()
    .setFooter({ text: 'oxyinc ❤️' });
}

client.commands = new Collection();
const commands = [];

const commandsPath = path.join(__dirname, 'komutlar');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
    logger.info(`Komut yüklendi: ${command.data.name}`);
  } else {
    logger.warn(`Komut ${filePath} gerekli "data" veya "execute" özelliğine sahip değil.`);
  }
}

const eventsPath = path.join(__dirname, 'eventler');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(client, db, logger, getCache, BaseEmbed, config, ...args));
  } else {
    client.on(event.name, (...args) => event.execute(client, db, logger, getCache, BaseEmbed, config, ...args));
  }
}

async function deployCommands() {
  const rest = new REST({ version: '10' }).setToken(config.token);
  
  try {
    logger.info(`${commands.length} adet slash komut yükleniyor...`);
    
    const data = await rest.put(
      Routes.applicationCommands(client.user.id),
      { body: commands },
    );
    
    logger.success(`${data.length} adet slash komut başarıyla yüklendi!`);
  } catch (error) {
    logger.error(`Slash komutları yüklenirken hata: ${error}`);
  }
}

client.on('interactionCreate', async interaction => { // discord.gg/vsc ❤️ oxyinc
  if (!interaction.isChatInputCommand()) return;
  
  const command = client.commands.get(interaction.commandName);
  if (!command) return;
  
  try {
    await command.execute(interaction, client, db, logger, getCache, BaseEmbed, config);
  } catch (error) {
    logger.error(`Komut hatası: ${error}`);
    const reply = { content: 'Komut çalıştırılırken bir hata oluştu!', ephemeral: true };
    
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp(reply);
    } else {
      await interaction.reply(reply);
    }
  }
});

client.once('ready', async () => {
  logger.success(`Bot başarıyla Discord'a giriş yaptı: ${client.user.tag}`);
  
  await deployCommands();

  client.user.setActivity('oxyinc ❤️', { type: 'WATCHING' });
});

client.login(config.token).catch(error => {
  logger.error(`Bot giriş hatası: ${error}`);
});