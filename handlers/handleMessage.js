const discord = require('discord.js');
const config = require(`${process.cwd()}/config.json`);

module.exports = async (client) => {
  client.handleMessage = async function(message) {
    if (message.author.bot) return;
    if (!message.guild) return;
    let enabled = await client.db.get(`guild_${message.guild.id}.enabled`);
    let le = await client.db.get(`guild_${message.guild.id}.lang`);
    let lang;
    if (le === null | le === undefined | lang === null | lang === undefined) lang = 'en';
    if (le) lang = le;

    if (message.content.match(`^<@!?${client.user.id}>( |)$`)) {
      let togetstarted;
      if (lang != 'en' || lang != 'english') {
        togetstarted = await client.translate(`My Prefix Is \`${client.config.bot.prefix}\`, Use my \`Help\` Command To Get Started!`, {
          to: lang
        });
      } else {
        togetstarted = {
          text: `My Prefix Is \`${client.config.bot.prefix}\`, Use my \`Help\` Command To Get Started!`
        }
      }
      const prefixembed = new discord.MessageEmbed()
        .setDescription(`**${togetstarted.text}**`)
        .setColor(client.color);
      message.lineReplyNoMention(prefixembed);
    }

    if (!message.content.startsWith(client.config.bot.prefix)) return;
    const args = message.content.slice(client.config.bot.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.toLowerCase() === 'setping') {
      let noperms;
      if (lang != 'en' || lang != 'english') {
        noperms = await client.translate(`**You Don't Have Enough Permissions!**`, {
          to: lang
        });
      } else {
        noperms = {
          text: `**You Don't Have Enough Permissions!**`
        }
      }
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReplyNoMention(noperms.text)
      const role = message.guild.roles.cache.find(r => r.name == args.slice(1).join(" ")) || message.guild.roles.cache.get(args.slice(1).join(" ")) || message.mentions.roles.first();
      let tier = args[1];
      let plsmention;
      let plschoose;
      if (lang != 'en' || lang != 'english') {
        plsmention = await client.translate(`**Please Mention a Role!**`, {
          to: lang
        });
        plschoose = await client.translate(`**Please Choose a Tier! Example: t1**`, {
          to: lang
        });
      } else {
        plsmention = {
          text: `**Please Mention a Role!**`
        }
        plschoose = {
          text: `**Please Choose a Tier! Example: t1**`
        }
      }
      if (!role) return message.lineReplyNoMention(plsmention.text)
      if (!tier) return message.lineReplyNoMention(plschoose.text)
      let invalidmsg;
      if (lang != 'en' || lang != 'english') {
        invalidmsg = await client.translate(`**Invalid Tier!**`, {
          to: lang
        });
      } else {
        invalidmsg = {
          text: `**Invalid Tier!**`
        }
      }
      let toset;
      if (tier.toLowerCase() === 't1') toset = 't1';
      else if (tier.toLowerCase() === 't2') toset = 't2';
      else if (tier.toLowerCase() === 't3') toset = 't3';
      else if (tier.toLowerCase() === 't4') toset = 't4';
      else if (tier.toLowerCase() === 't5') toset = 't5';
      else if (tier.toLowerCase() === 't6') toset = 't6';
      else if (tier.toLowerCase() === 'ts') toset = 'ts';
      else return message.lineReplyNoMention(invalidmsg.text);
      const embed = new discord.MessageEmbed()
        .setDescription(`**<@&${role.id}>: ${toset.toLowerCase()}**`)
        .setColor(client.color)
      await client.db.set(`guild_${message.guild.id}.${toset.toLowerCase()}`, role.id).then(d => {
        message.lineReplyNoMention(embed)
      })
    }
    if (cmd.toLowerCase() === 'disableping') {
      let noperms;
      if (lang != 'en' || lang != 'english') {
        noperms = await client.translate(`**You Don't Have Enough Permissions!**`, {
          to: lang
        });
      } else {
        noperms = {
          text: `**You Don't Have Enough Permissions!**`
        }
      }
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReplyNoMention(noperms.text)
      let tier = args[0];
      let choose;
      if (lang != 'en' || lang != 'english') {
        choose = await client.translate(`**Please Choose a Tier! Example: t1**`, {
          to: lang
        });
      } else {
        choose = {
          text: `**Please Choose a Tier! Example: t1**`
        }
      }
      if (!tier) return message.lineReplyNoMention(choose.text)
      let toset;
      if (tier.toLowerCase() === 't1') toset = 't1';
      else if (tier.toLowerCase() === 't2') toset = 't2';
      else if (tier.toLowerCase() === 't3') toset = 't3';
      else if (tier.toLowerCase() === 't4') toset = 't4';
      else if (tier.toLowerCase() === 't5') toset = 't5';
      else if (tier.toLowerCase() === 't6') toset = 't6';
      else if (tier.toLowerCase() === 'ts') toset = 'ts';
      const added = await client.db.get(`guild_${message.guild.id}.${toset.toLowerCase()}`)
      let notadd;
      if (lang != 'en' || lang != 'english') {
        notadd = await client.translate(`**Not Added!**`, {
          to: lang
        });
      } else {
        notadd = {
          text: `**Not Added!**`
        }
      }
      if (!added) return message.lineReplyNoMention(notadd.text)
      await client.db.delete(`guild_${message.guild.id}.${toset.toLowerCase()}`).then(async d => {
        let removed;
        if (lang != 'en' || lang != 'english') {
          removed = await client.translate(`**Removed!**`, {
            to: lang
          });
        } else {
          removed = {
            text: `**Removed!**`
          }
        }
        message.lineReplyNoMention(removed.text)
      })
    }
    if (cmd.toLowerCase() === 'help') {
      const help = new discord.MessageEmbed()
        .setColor(client.color)
        .addField(`Shoob`, `**\`${client.config.bot.prefix}lastclaim\`, \`${client.config.bot.prefix}recentclaims\`, \`${client.config.bot.prefix}claimleaderboard\`, \`${client.config.bot.prefix}setping\`, \`${client.config.bot.prefix}disableping\`, \`${client.config.bot.prefix}enable\`, \`${client.config.bot.prefix}disable\`, \`${client.config.bot.prefix}listpings\`**`)
        .addField(`Info`, `**\`${client.config.bot.prefix}ping\`, \`${client.config.bot.prefix}invite\`**`)
        .addField(`Settings`, `**\`${client.config.bot.prefix}setlang\`**`)
        //.addField(`Owner`, `\`\`\`yaml\n${client.users.cache.get(client.config.bot.owner).tag}\n\`\`\``)
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(client.user.username + ' | Owner: ' + client.users.cache.get(client.config.bot.owner).tag, `https://cdn.discordapp.com/emojis/783636544720207903.png?v=1`)
      message.lineReplyNoMention(help)
    }

    if (cmd.toLowerCase() === 'ping') {
      message.lineReplyNoMention(`**${client.ws.ping}ms**`)
    }

    if (cmd.toLowerCase() === 'invite') {
      message.lineReplyNoMention(`**<https://discord.com/oauth2/authorize?client_id=848947219608371251&permissions=8&scope=bot>**`)
    }

    if (cmd.toLowerCase() === 'enable') {
      let noperms;
      let iwill;
      if (lang != 'en' || lang != 'english') {
        noperms = await client.translate(`**You Don't Have Enough Permissions!**`, {
          to: lang
        });
        iwill = await client.translate(`**I Will Now Track Shoob!**`, {
          to: lang
        });
      } else {
        noperms = {
          text: `**You Don't Have Enough Permissions!**`
        }
        iwill = {
          text: `**I Will Now Track Shoob!**`
        }
      }
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReplyNoMention(noperms.text)
      await client.db.set(`guild_${message.guild.id}.enabled`, 1).then(d => {
        message.lineReplyNoMention(iwill.text)
      })
    }

    if (cmd.toLowerCase() === 'disable') {
      let noperms;
      let iwillnot;
      let noten;
      if (lang != 'en' || lang != 'english') {
        noperms = await client.translate(`**You Don't Have Enough Permissions!**`, {
          to: lang
        });
        iwillnot = await client.translate(`**I Won't Track Shoob Anymore!**`, {
          to: lang
        });
        noten = await client.translate(`Im Not Enabled!`, {
          to: lang
        })
      } else {
        noperms = {
          text: `**You Don't Have Enough Permissions!**`
        }
        iwillnot = {
          text: `**I Won't Track Shoob Anymore!**`
        }
        noten = {
          text: `Im Not Enabled!`
        }
      }
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReplyNoMention(noperms.text)
      if (!enabled) return message.lineReplyNoMention(`**${noten.text}\nUse \`>enable\` To Enable Me!**`);
      await client.db.delete(`guild_${message.guild.id}.enabled`).then(d => {
        message.lineReplyNoMention(iwillnot.text)
      })
    }

    if (cmd.toLowerCase() === 'listpings') {
      if (!enabled) return message.lineReplyNoMention(`**${noten.text}\nUse \`>enable\` To Enable Me!**`);
      let none;
      if (lang != 'en' || lang != 'english') {
        none = await client.translate(`None`, {
          to: lang
        });
      } else {
        none = {
          text: 'None'
        }
      }
      const t1s = await client.db.get(`guild_${message.guild.id}.t1`)
      const t2s = await client.db.get(`guild_${message.guild.id}.t2`)
      const t3s = await client.db.get(`guild_${message.guild.id}.t3`)
      const t4s = await client.db.get(`guild_${message.guild.id}.t4`)
      const t5s = await client.db.get(`guild_${message.guild.id}.t5`)
      const t6s = await client.db.get(`guild_${message.guild.id}.t6`)
      const tss = await client.db.get(`guild_${message.guild.id}.ts`)
      let pings = []
      if (t1s) pings.push('T1: <@&' + t1s + '>')
      if (t2s) pings.push('T2: <@&' + t2s + '>')
      if (t3s) pings.push('T3: <@&' + t3s + '>')
      if (t4s) pings.push('T4: <@&' + t4s + '>')
      if (t5s) pings.push('T5: <@&' + t5s + '>')
      if (t6s) pings.push('T6: <@&' + t6s + '>')
      if (tss) pings.push('TS: <@&' + tss + '>')
      let embed = new discord.MessageEmbed()
        .setDescription(`**${pings.join('\n') || none.text}**`)
        .setColor(client.color)
      message.lineReplyNoMention(embed)
    }

    if (cmd.toLowerCase() === 'recentclaims') {
      if (!enabled) return message.lineReplyNoMention(`**Im Not Enabled!\nUse \`>enable\` To Enable Me!**`);
      let dball = await client.db.all()
      let claims = dball.filter(a => a.ID.startsWith(`guild_${message.guild.id}`) && a.data.recentclaims)
      let claimstotrim = [];
      claims[0].data.recentclaims.forEach(async claim => {
        claimstotrim.push(claim)
      })
      let claimstodesc = await client.trimArr(claimstotrim, 10)
      let none;
      let foot;
      if (lang != 'en' || lang != 'english') {
        none = await client.translate(`**No Data!**`, {
          to: lang
        });
        foot = await client.translate(`This Data Deletes Itself If There Are More Than 10 Claims!`, {
          to: lang
        })
      } else {
        none = {
          text: `**No Data!**`
        }
        foot = {
          text: `This Data Deletes Itself If There Are More Than 10 Claims!`
        }
      }
      const claimembed = new discord.MessageEmbed()
        .setColor(client.color)
        .setDescription(claimstodesc.reverse().join('\n') || none.text)
        .setFooter(foot.text)
      message.lineReplyNoMention(claimembed).then(async msg => {
        if (!claimstotrim || !claimstotrim.length) claimstotrim.length = 0;
        if (claimstotrim.length > 10) {
          setTimeout(async function() {
            await client.db.delete(`guild_${message.guild.id}.recentclaims`)
          }, 10000)
        }
      })
    }

    /*if (cmd.toLowerCase() === 'userclaims') {
      let user = message.mentions.users.first() || message.guild.members.cache.find(m => m.user.tag === args[0]) || message.guild.members.cache.get(args[0]) || message.author;
      const t1 = await client.db.get(`userclaims_${user.id}.t1`) || 0;
      const t2 = await client.db.get(`userclaims_${user.id}.t2`) || 0;
      const t3 = await client.db.get(`userclaims_${user.id}.t3`) || 0;
      const t4 = await client.db.get(`userclaims_${user.id}.t4`) || 0;
      const t5 = await client.db.get(`userclaims_${user.id}.t5`) || 0;
      const t6 = await client.db.get(`userclaims_${user.id}.t6`) || 0;
      const embed = new discord.MessageEmbed()
      .setColor(client.color)
      .setDescription(`**T1: \`${t1}\`\nT2: \`${t2}\`\nT3: \`${t3}\`\nT4: \`${t4}\`\nT5: \`${t5}\`\nT6: \`${t6}\`**`)
      message.lineReplyNoMention(`**${user.username}'s Claim Stats**`, embed)
    }*/

    if (cmd.toLowerCase() === 'claimleaderboard') {
      let choose;
      if (lang != 'en' || lang != 'english') {
        choose = await client.translate(`**Choose a Leaderboard! Example:`, {
          to: lang
        });
      } else {
        choose = {
          text: `**Choose a Leaderboard! Example:`
        }
      }
      if (!args[0]) return message.lineReplyNoMention(choose.text + ' \`global\`/\`guild\`**')
      let leaderboard = await client.db.all()
      if (args[0] === 'global') {
        let fileteredlb = leaderboard.filter(a => a.ID.startsWith('user_')).sort((a, b) => b - a);
        const lb = [];
        const glb = [];
        let users = [];
        let claims = [];
        fileteredlb.forEach(async value => {
          let id = value.ID.replace(`user_`, '')
          glb.push(`**${client.users.cache.get(id).tag} => \`${value.data.claims}\` Claims**`)
          users.push(`**<@${id}>**`)
          claims.push(`**\`${value.data.claims} Claims\`**`)
        });
        let trimmed = await client.trimArr(lb)
        let trimmedusers = await client.trimArr(users, 10)
        let trimmedclaims = await client.trimArr(claims, 10)
        const leaderboardembed = new discord.MessageEmbed()
          .setColor(client.color)
          .addField(`> Users`, `> ` + trimmedusers.join('\n> '), true)
          .addField(`> Claims`, `> ` + trimmedclaims.join('\n> '), true)
        return message.lineReplyNoMention(`**Global ${client.user.username} Leaderboard**`, leaderboardembed)
      } else if (args[0] === 'guild') {
        let fileteredlbb = leaderboard.filter(a => a.ID.startsWith('guild_')).sort((a, b) => b - a);
        const glb = [];
        let users = [];
        let claims = [];
        let found = fileteredlbb.find(a => a.ID.startsWith(`guild_${message.guild.id}`))
        for (let key of Object.keys(found.data)) {
          if (key.startsWith('user_')) {
            users.push(`**<@${key.replace('user_', '')}>**`)
          }
        }
        for (let key of Object.values(found.data)) {
          if (key.claims) {
            claims.push(`**\`${key.claims} Claims\`**`)
          }
        }
        let trimmed = await client.trimArr(glb)
        let trimmedusers = await client.trimArr(users, 10)
        let trimmedclaims = await client.trimArr(claims, 10)
        const leaderboardembedd = new discord.MessageEmbed()
          .setColor(client.color)
          .addField(`> Users`, `> ` + trimmedusers.join('\n> '), true)
          .addField(`> Claims`, `> ` + trimmedclaims.join('\n> '), true)
        return message.lineReplyNoMention(`**${message.guild.name}'s ${client.user.username} Leaderboard**`, leaderboardembedd)
      } else {
        let fileteredlb = leaderboard.filter(a => a.ID.startsWith('user_')).sort((a, b) => b - a);
        const lb = [];
        const glb = [];
        let users = [];
        let claims = [];
        fileteredlb.forEach(async value => {
          let id = value.ID.replace(`user_`, '')
          glb.push(`**${client.users.cache.get(id).tag} => \`${value.data.claims}\` Claims**`)
          users.push(`**<@${id}>**`)
          claims.push(`**\`${value.data.claims} Claims\`**`)
        });
        let trimmed = await client.trimArr(lb)
        let trimmedusers = await client.trimArr(users, 10)
        let trimmedclaims = await client.trimArr(claims, 10)
        const leaderboardembed = new discord.MessageEmbed()
          .setColor(client.color)
          .addField(`> Users`, `> ` + trimmedusers.join('\n> '), true)
          .addField(`> Claims`, `> ` + trimmedclaims.join('\n> '), true)
        return message.lineReplyNoMention(`**Global ${client.user.username} Leaderboard**`, leaderboardembed)
      }
    }

    if (cmd.toLowerCase() === 'lastclaim') {
      let last;
      let nodata;
      if (lang != 'en' || lang != 'english') {
        last = await client.translate(`Last Card Claim**`, {
          to: lang
        });
        nodata = await client.translate('No Data!', {
          to: lang
        })
      } else {
        last = {
          text: `Last Card Claim**`
        }
        nodata = {
          text: 'No Data!'
        }
      }
      const lastclaim = await client.db.get(`guild_${message.guild.id}.lastcardclaim`) || nodata.text
      const lastclaimembed = new discord.MessageEmbed()
        .setColor(client.color)
        .setDescription(`**${lastclaim}**`)
      message.lineReplyNoMention(`**${message.guild.name} - ${last.text}`, lastclaimembed)
    }

    if (cmd.toLowerCase() === 'setlang') {
      let noperms;
      let plschooselang;
      let invalidlang;
      if (lang != 'en' || lang != 'english') {
        noperms = await client.translate(`**You Don't Have Enough Permissions!**`, {
          to: lang
        });
        plschooselang = await client.translate(`**Please Choose a Language!**`, {
          to: lang
        });
        invalidlang = await client.translate(`**Invalid Language!**`, {
          to: lang
        });
      } else {
        noperms = {
          text: `**You Don't Have Enough Permissions!**`
        }
        plschooselang = {
          text: `**Please Choose a Language!**`
        }
        invalidlang = {
          text: `**Invalid Language!**`
        }
      }
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReplyNoMention(noperms.text)
      const langs = ["afrikaans", "albanian", "amharic", "arabic", "armenian", "azerbaijani", "bangla", "basque", "belarusian", "bengali", "bosnian", "bulgarian", "burmese", "catalan", "cebuano", "chichewa", "corsican", "croatian", "czech", "danish", "dutch", "english", "esperanto", "estonian", "filipino", "finnish", "french", "frisian", "galician", "georgian", "german", "greek", "gujarati", "haitian creole", "hausa", "hawaiian", "hebrew", "hindi", "hmong", "hungarian", "icelandic", "igbo", "indonesian", "irish", "italian", "japanese", "javanese", "kannada", "kazakh", "khmer", "korean", "kurdish (kurmanji)", "kyrgyz", "lao", "latin", "latvian", "lithuanian", "luxembourgish", "macedonian", "malagasy", "malay", "malayalam", "maltese", "maori", "marathi", "mongolian", "myanmar (burmese)", "nepali", "norwegian", "nyanja", "pashto", "persian", "polish", "portugese", "punjabi", "romanian", "russian", "samoan", "scottish gaelic", "serbian", "sesotho", "shona", "sindhi", "sinhala", "slovak", "slovenian", "somali", "spanish", "sundanese", "swahili", "swedish", "tajik", "tamil", "telugu", "thai", "turkish", "ukrainian", "urdu", "uzbek", "vietnamese", "welsh", "xhosa", "yiddish", "yoruba", "zulu", "bg"];
      let language = args[0];
      if (!language) return message.lineReplyNoMention(plschooselang.text)
      if (language === 'reset') {
        await client.db.delete(`guild_${message.guild.id}.lang`)
        return message.lineReplyNoMention(`**Language: English**`)
      }
      if (language === 'list') {
        const embed = new discord.MessageEmbed()
          .setColor(client.color)
          .setDescription(`\`\`\`css\n${langs.map((l, i) => `#${i+1} - ${l}`).join("\n")}\n\`\`\``)
        return message.lineReplyNoMention(embed)
      }
      if (!langs.includes(language.toLowerCase())) return message.lineReplyNoMention(invalidlang.text)
      await client.db.set(`guild_${message.guild.id}.lang`, language.toLowerCase()).then(async () => {
        message.lineReplyNoMention(`**Language: ${language.charAt(0).toUpperCase() + language.slice(1)}**`)
      })
    }

    if (cmd.toLowerCase() === 'eval') {
      if (message.author.id != "484701017015975936") return;
      const code = args.join(" ");
      if (!code) return message.lineReplyNoMention("**Please Provide Some Code!**")
      try {
        let evaled = eval(code);
        if (typeof evaled !== "string")
          evaled = require("util").inspect(evaled);
        const success = new discord.MessageEmbed()
          .addField(`Code:`, `\`\`\`js\n${code}\n\`\`\``, false)
          .addField(`Output:`, `\`\`\`js\n${evaled}\n\`\`\``, false)
          .addField(`Type:`, `\`\`\`js\n` + typeof(evaled) + `\n\`\`\``, false)
          .setColor(client.color)
          .setFooter("Success")
        message.lineReplyNoMention(success)
      } catch (e) {
        const errem = new discord.MessageEmbed()
          .addField(`Code:`, `\`\`\`js\n${code}\n\`\`\``, false)
          .addField(`Output:`, `\`\`\`js\n${e}\n\`\`\``, false)
          .addField(`Type:`, `\`\`\`js\n` + typeof(evaled) + `\n\`\`\``, false)
          .setColor(client.color)
          .setFooter("Error")
        message.lineReplyNoMention(errem)
      }
    }
  }
}
