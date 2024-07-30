const discord = require('discord.js');
const config = require(`${process.cwd()}/config.json`);

module.exports = async (client) => {
  client.handleShoob = async function(message) {
    let enabled = await client.db.get(`guild_${message.guild.id}.enabled`)
    let le = await client.db.get(`guild_${message.guild.id}.lang`);
    let lang;
    if (le === null | le === undefined | lang === null | lang === undefined) lang = 'en';
    if (le) lang = le;
    if (message.author.id === client.shoob && message.content && enabled === 1) {
      if (message.content.startsWith(`Looks like no one got the card`)) {


        //**Claimed By:  <@484701017015975936> | Card:  `Citron` Issue #: `1716`**
        message.delete()
        message.channel.send(`**${message.content}**`).then(async msg => {
          let tosetindb = `Claimed By:  \`No One\` | [Card](${msg.url}): ` + `${message.content.replace(' at this time..', '').replace(`Looks like no one got the card`, '')}`
          await client.db.push(`guild_${message.guild.id}.recentclaims`, `**${tosetindb}**`)
          if (msg.content.includes('T1')) msg.delete({
            timeout: 300000
          })
          else if (msg.content.includes('T2')) msg.delete({
            timeout: 300000
          })
        })
      }
    }
    if (message.author.id === client.shoob && message.embeds[0] && enabled === 1) {
      let tiertranslate;
      if (lang != 'en' || lang != 'english') {
        tiertranslate = await client.translate(`Tier`, {
          to: lang
        });
      } else {
        tiertranslate = {
          text: `Tier`
        }
      }
      const t1 = await client.db.get(`guild_${message.guild.id}.t1`)
      const t2 = await client.db.get(`guild_${message.guild.id}.t2`)
      const t3 = await client.db.get(`guild_${message.guild.id}.t3`)
      const t4 = await client.db.get(`guild_${message.guild.id}.t4`)
      const t5 = await client.db.get(`guild_${message.guild.id}.t5`)
      const t6 = await client.db.get(`guild_${message.guild.id}.t6`)
      const ts = await client.db.get(`guild_${message.guild.id}.ts`)
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier: 1') && t1) {
        message.lineReplyNoMention(`**<@&${t1}> ${tiertranslate.text}: 1**`).then(msg => msg.delete({
          timeout: 300000
        }))
      }
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier: 2') && t2) {
        message.lineReplyNoMention(`**<@&${t2}> ${tiertranslate.text}: 2**`).then(msg => msg.delete({
          timeout: 300000
        }))
      }
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier: 3') && t3) {
        message.lineReplyNoMention(`**<@&${t3}> ${tiertranslate.text}: 3**`).then(msg => msg.delete({
          timeout: 300000
        }))
      }
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier: 4') && t4) {
        message.lineReplyNoMention(`**<@&${t4}> ${tiertranslate.text}: 4**`).then(msg => msg.delete({
          timeout: 300000
        }))
      }
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier: 5') && t5) {
        message.lineReplyNoMention(`**<@&${t5}> ${tiertranslate.text}: 5**`).then(msg => msg.delete({
          timeout: 300000
        }))
      }
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier: 6') && t6) {
        message.lineReplyNoMention(`**<@&${t6}> ${tiertranslate.text}: 6**`).then(msg => msg.delete({
          timeout: 300000
        }))
      }
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier: S') && ts) message.lineReplyNoMention(`**<@&${ts}> ${tiertranslate.text}: S**`).then(msg => msg.delete({
        timeout: 300000
      }))
      if (message.embeds[0].url === 'https://animesoul.com' && message.embeds[0].title.includes('Tier')) {

        //${message.embeds[0].title.substring(message.embeds[0].title.length - 7)} Tier: count
        let willdespawn;
        let translateseconds;
        if (lang != 'en' || lang != 'english') {
          willdespawn = await client.translate(`Spawned! The Card Will Despawn In`, {
            to: lang
          });
          translateseconds = await client.translate(`Seconds`, {
            to: lang
          });
        } else {
          willdespawn = {
            text: `Spawned! The Card Will Despawn In`
          }
          translateseconds = {
            text: `Seconds`
          }
        }
        const embed = new discord.MessageEmbed()
          .setColor(client.color)
          .setDescription(`**${message.embeds[0].title} ${willdespawn.text} 13 ${translateseconds.text}!**`)
        message.channel.send(embed).then(async msg => {
          var timeleft = 12;
          var timeinterval = setInterval(function() {
            const embed = new discord.MessageEmbed()
              .setColor(client.color)
              .setDescription(`**${message.embeds[0].title} ${willdespawn.text} ${timeleft} ${translateseconds.text}!**`)
            timeleft -= 1;
            try {
              msg.edit(embed)
            } catch (e) {}
            if (timeleft < 1) {
              timeleft = 0;
              clearInterval(timeinterval)
              msg.delete().catch(() => {})
            }
          }, 1000)
          setTimeout(function() {
            clearInterval(timeinterval)
          }, 15000)
          let filter = m => m.author.id === client.shoob;
          let collector = new discord.MessageCollector(message.channel, filter, {
            max: 10,
            time: 1000 * 13
          })

          collector.on('collect', async m => {
            if (m.content.includes('You are on cooldown for this tier')) return;
            try {
              clearInterval(timeinterval)
              msg.delete()
            } catch (e) {}
          })

        })
      }
      if (message.embeds[0].description.startsWith(`<:green:731633597391569017>`) && message.embeds[0].description.includes('got the card')) {

        let gotthecard;
        if (lang != 'en' || lang != 'english') {
          gotthecard = await client.translate(`got the card!`, {
            to: lang
          });
        } else {
          gotthecard = {
            text: `got the card!`
          }
        }
        let recentclaim = message.embeds[0].description.replace('<:green:731633597391569017>', '')
        if (message.embeds[0].description.includes('Sent from Clyde!')) {
          recentclaim = recentclaim.replace('Sent from Clyde!', '')
        }
        const embed = new discord.MessageEmbed()
          .setColor(client.color)
          .setDescription(`**${recentclaim.replace('got the card!', gotthecard.text)}**`)


        message.channel.send(embed).then(async msg => {
          //`Claimed By:  \`No One\` | [Card](${msg.url}): ` + `${message.content.replace(' at this time..', '').replace(`Looks like no one got the card`, '')}`
          let dbrecent = '**' + 'Claimed By: ' + recentclaim.replace(`got the card!`, `| [Card](${msg.url}):`) + '**'
          await client.db.push(`guild_${message.guild.id}.recentclaims`, dbrecent)
          await client.db.set(`guild_${message.guild.id}.lastcardclaim`, dbrecent)
        })
        message.delete({
          timeout: 300
        })
        if (message.embeds[0].description.includes('<@') && message.embeds[0].description.includes('>')) {
          let ttlenght;
          if (message.embeds[0].description.includes('Sent from Clyde!')) ttlenght = 17;
          else ttlenght = 1;
          let userid = message.embeds[0].description.substring(28, message.embeds[0].description.length - ttlenght).substring(0, 20).replace('<@', '').replace('>', '')
          client.db.add(`user_${userid}.claims`, 1)
          client.db.add(`guild_${message.guild.id}.user_${userid}.claims`, 1)

          /*message.channel.messages.fetch({
            limit: 10
          }).then(async msgs => {
            let lastuserclaim = await client.db.get(`lastclaim_${message.channel.id}`);
            msgs.forEach(async msg => {
              if (msg.author.id === client.shoob && msg.embeds[0] && msg.embeds[0].title) {
                console.log(msg)
                if (msg.embeds[0].title.includes('Tier: 1')) client.db.set(`lastclaim_${message.channel.id}`, 't1')
                if (msg.embeds[0].title.includes('Tier: 2')) client.db.set(`lastclaim_${message.channel.id}`, 't2')
                if (msg.embeds[0].title.includes('Tier: 3')) client.db.set(`lastclaim_${message.channel.id}`, 't3')
                if (msg.embeds[0].title.includes('Tier: 4')) client.db.set(`lastclaim_${message.channel.id}`, 't4')
                if (msg.embeds[0].title.includes('Tier: 5')) client.db.set(`lastclaim_${message.channel.id}`, 't5')
                if (msg.embeds[0].title.includes('Tier: 6')) client.db.set(`lastclaim_${message.channel.id}`, 't6')
              }
              if (!msg.bot && msg.content.includes('claim ')) {
                let lastuserclaimm = await client.db.get(`lastclaim_${message.channel.id}`) || 't1';
                console.log(msg.first().content)
                await client.db.add(`userclaims_${msg.author.id}.${lastuserclaimm}`, 1).catch(e => console.log(e))
              }

              setTimeout(async function() {
                await client.db.delete(`lastclaim_${message.channel.id}`)
              }, 500)
            })
          })*/
        }
      }
    }
  }
}
