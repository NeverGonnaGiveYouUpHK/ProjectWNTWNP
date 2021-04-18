require('dotenv').config();

const Discord = require('discord.js');

const config = require('./config/config');

global.bot = new Discord.Client();
global.bot.login(process.env.TOKEN);

global.users = new Map();

<<<<<<< HEAD
const users = global.users;
const bot = global.bot;


const prefix = "!";
=======
const PermissionManager = require('./server/permissionManager');
const permissionAPI = require('./api/permission')
>>>>>>> 2bcb9b03ad679659cb6a16059f497f8c4e6c17da

const reminderHandle = require('./handles/reminderHandle');
const timezoneHandle = require('./handles/timezoneHandle');

const help = require('./help');

const permissionTesInstance = new PermissionManager();

bot.on('ready', () => {
	bot.on('message', async (msg) => {
		if (!msg.content.startsWith(prefix)) return;
		
		const split = msg.content.split(' ');

		
		const commandWithPrefix = split[0];
		const command = commandWithPrefix.substring(prefix.length, commandWithPrefix.length);
		
		const args = split.slice(1, split.length);



		const userID = msg.author.id;
		let user;
		if (!users.has(userID)){
			user = new config.User(userID);
			await user.initialize();
			users.set(userID, user);
		} else {
			user = users.get(userID);
		}



		switch (command){
			case 'reminder':
				reminderHandle(msg, user, args);
				break;

			case 'timezone':
				timezoneHandle(msg, user, args);
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