const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const express = require('express');
const app = express();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const prefix = '!';
const adminPassword = 'ELYA_ADMIN_313';
let admins = [];
let teams = [];

client.on('ready', () => {
  console.log(`✅ Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split('|').map(arg => arg.trim());
  const command = args[0];

  if (command === 'إضافة_مشرف') {
    if (args[1] === adminPassword) {
      if (!admins.includes(message.author.id)) {
        admins.push(message.author.id);
        message.reply('✅ تم إضافتك كمشرف.');
      } else {
        message.reply('✅ أنت مشرف بالفعل.');
      }
    } else {
      message.reply('❌ كلمة السر غير صحيحة.');
    }
  }

  if (command === 'تسجيل') {
    if (args.length < 7) {
      return message.reply('❗ استخدم:\n`!تسجيل | اسم الفريق | الموعد | القائد | عضو1:دوره | عضو2:دوره | عضو3:دوره | عضو4:دوره`');
    }

    const team = {
      name: args[1],
      time: args[2],
      leader: args[3],
      players: args.slice(4, 8)
    };

    teams.push(team);
    message.reply(`✅ تم تسجيل الفريق **${team.name}**!`);
  }

  if (command === 'القائمة') {
    if (teams.length === 0) return message.reply('📭 لا يوجد فرق مسجلة.');

    let reply = '📋 **قائمة الفرق:**\n';
    teams.forEach((t, i) => {
      reply += `\n${i + 1}. ${t.name} - ${t.leader} - ${t.time}\n${t.players.join('\n')}\n`;
    });
    message.reply(reply);
  }

  if (command === 'مسح') {
    if (!admins.includes(message.author.id)) {
      return message.reply('🚫 هذا الأمر للمشرفين فقط.');
    }
    teams = [];
    message.reply('🗑️ تم مسح كل الفرق.');
  }

  if (command === 'المشرفين') {
    if (admins.length === 0) return message.reply('🚫 لا يوجد مشرفين.');
    message.reply(`👮‍♂️ المشرفين:\n${admins.map(id => `<@${id}>`).join('\n')}`);
  }

  if (command === 'مساعدة') {
    message.reply(`
🛠️ **أوامر البوت:**
!تسجيل | الفريق | الموعد | القائد | عضو1:دوره | عضو2:دوره | عضو3:دوره | عضو4:دوره  
!القائمة  
!إضافة_مشرف | كلمة السر  
!المشرفين  
!مسح  
!مساعدة
    `);
  }
});

client.login(process.env.TOKEN);

app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(3000, () => console.log('🌐 Web server is up.'));
