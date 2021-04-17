require('dotenv').config();

const Discord = require('discord.js');

global.bot = new Discord.Client();
global.bot.login(process.env.TOKEN);

const prefix = "!";

global.users = new Map();

const reminderHandle = require('./handles/reminderHandle');

bot.on('ready', () => {
	bot.on('message', async (msg) => {
		if (!msg.content.startsWith(prefix)) return;
		
		const split = msg.content.split(' ');

		const commandWithPrefix = split[0];
		const command = commandWithPrefix.substring(prefix.length, commandWithPrefix.length);
		
		const args = split.slice(1, split.length);

		switch (command){
			case 'reminder':
				reminderHandle(msg, args)
				break;

			default:
				break;
		}
	});
});