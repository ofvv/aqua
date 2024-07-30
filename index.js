const discord = require("discord.js")

let config = require("./config.json")

require("discord-reply")

const client = new discord.Client({
  disableMentions: 'everyone'
})
require('discord-logs')(client);

const {
  Database
} = require("quickmongo");

['functions', 'handleMessage', 'handleShoob', 'handleGhostChat'].forEach(async handle => {
  require(`./handlers/${handle}`)(client)
});

client.color = config.bot.color || '#000001';
client.shoob = '673362753489993749';
client.config = config;
client.db = new Database(client.config.bot.mongo);

client.db.on('ready', async () => {
  let date = new Date()
  let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  console.log(`[${time}] Database Connected!`)
})

client.on("ready", async () => {
  client.user.setStatus("dnd").then(() => {
    client.user.setActivity(`${client.config.bot.prefix}help`)
  })
  let date = new Date()
  let time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  console.log(`[${time}] ` + client.user.username)
})

client.on("message", async message => {
  let enabled = await client.db.get(`enabled_${message.guild.id}`)
  // SHOOB DETECTIOONS
  client.handleShoob(message)
  // SHOOB DETECTIOONS
  // handle #ghostchat
  client.handleGhost(message)
  // handle #ghostchat
  // BOT COMMANDS
  client.handleMessage(message)
  // BOT COMMANDS
})

client.on("guildDelete", async guild => {
  if (!guild) return;
  let enabled = await client.db.get(`enabled_${guild.id}`)
  const t1s = await client.db.get(`${guild.id}_t1`)
  const t2s = await client.db.get(`${guild.id}_t2`)
  const t3s = await client.db.get(`${guild.id}_t3`)
  const t4s = await client.db.get(`${guild.id}_t4`)
  const t5s = await client.db.get(`${guild.id}_t5`)
  const t6s = await client.db.get(`${guild.id}_t6`)
  const tss = await client.db.get(`${guild.id}_ts`)
  if (t1s) await client.db.delete(`${guild.id}_t1`)
  if (t2s) await client.db.delete(`${guild.id}_t2`)
  if (t3s) await client.db.delete(`${guild.id}_t3`)
  if (t4s) await client.db.delete(`${guild.id}_t4`)
  if (t5s) await client.db.delete(`${guild.id}_t5`)
  if (t6s) await client.db.delete(`${guild.id}_t6`)
  if (tss) await client.db.delete(`${guild.id}_ts`)
  if (enabled) await client.db.delete(`enabled_${guild.id}`)
  const embed = new discord.MessageEmbed()
    .setColor(client.color)
    .setDescription(`**${guild.name} => ${guild.id} | Members: ${guild.memberCount}**`)
  client.channels.cache.get('849001600273743923').send(`**Kicked**`, embed)
})

client.on("guildCreate", async guild => {
  if (!guild) return;
  const embed = new discord.MessageEmbed()
    .setColor(client.color)
    .setDescription(`**${guild.name} => ${guild.id} | Members: ${guild.memberCount}**`)
  client.channels.cache.get('849001600273743923').send(`**Invited**`, embed)
})

client.on('messageUpdate', async (oldMessage, newMessage) => {
  // handle #ghostchat
  client.handleGhost(newMessage)
  // handle #ghostchat
  // BOT COMMANDS
  client.handleMessage(newMessage)
  // BOT COMMANDS
})

client.login(config.bot.token)
