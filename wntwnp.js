require('dotenv').config();

const Discord = require('discord.js');

const config = require('./config/config');

global.bot = new Discord.Client();
global.bot.login(process.env.TOKEN);

global.users = new Map();

const users = global.users;
const bot = global.bot;


const prefix = "!";



const reminderHandle = require('./handles/reminderHandle');
const timezoneHandle = require('./handles/timezoneHandle');
const dateformatHandle = require('./handles/dateformatHandle');

const help = require('./help');

const PermissionManager = require('./server/permissionManager');
const permissionTesInstance = new PermissionManager();
const permissionAPI = require('./api/permission');

const TeamManager = require('./server/teamManager');
const teamTesInstance = new TeamManager();
const teamAPI = require('./api/team');



bot.on('ready', () => {
	bot.on('message', async (msg) => {
		if (!msg.content.startsWith(prefix)) return;
		
		const split = msg.content.split(' ');

		
		const commandWithPrefix = split[0];
		const command = commandWithPrefix.substring(prefix.length, commandWithPrefix.length).toLowerCase();
		
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

			case 'dateformat':
				dateformatHandle(msg, user, args);
				break;

			case 'help':
				msg.channel.send(help());
				break;

			case 'permission':
				msg.channel.send(permissionAPI(msg, args, permissionTesInstance));
				break;

			case 'team':
				msg.channel.send(teamAPI(msg, args, teamTesInstance, permissionTesInstance));
				break;


			default:
				break;
		}
	});
});