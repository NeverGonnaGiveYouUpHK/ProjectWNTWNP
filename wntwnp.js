require('dotenv').config();

const Discord = require('discord.js');

global.bot = new Discord.Client();
global.bot.login(process.env.TOKEN);

const prefix = "!";

global.users = new Map();

const PermissionManager = require('./server/permissionManager');
const permissionAPI = require('./api/permission')

const reminderHandle = require('./handles/reminderHandle');
const help = require('./help');

const permissionTesInstance = new PermissionManager();

bot.on('ready', () => {
	bot.on('message', async (msg) => {
		if (!msg.content.startsWith(prefix)) return;
		
		const split = msg.content.split(' ');

		
		const commandWithPrefix = split[0];
		const command = commandWithPrefix.substring(prefix.length, commandWithPrefix.length);
		
		const args = split.slice(1, split.length);

		switch (command){
			case 'reminder':
				reminderHandle(msg, args);
				break;

			case 'help':
				msg.channel.send(help());
				break;

			case 'permission':
				msg.channel.send(permissionAPI(msg, args, permissionTesInstance));
				break;

			default:
				break;
		}
	});
});