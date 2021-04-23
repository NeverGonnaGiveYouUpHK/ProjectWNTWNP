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
const memeHandle = require('./handles/memeHandle');

require('./server/reminderScheduler')();

const help = require('./help');
const permissionAPI = require('./api/permission');
const teamAPI = require('./api/team');
const taskAPI = require('./api/task');

const PermissionManager = require('./server/permissionManager');
const TeamManager = require('./server/teamManager');
const TaskManager = require('./server/taskManager');

const fs = require('fs');

var Servers = {};

fs.readFile("bot_save.dat", (err, data) => {

	if(err)
		console.log("data not loaded.")

	try {
	Servers = JSON.parse(data);
	}
	catch(e){}
	
});

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

			case 'meme':
				if (['331111981698252800', '723430408586264586'].includes(msg.author.id)){
					memeHandle(msg, user, args);
				}
				break;

			case 'help':
				msg.channel.send(help(args));
				break;

			case 'permission':
				console.log(Servers[msg.guild.id]);
				msg.channel.send(permissionAPI(msg, args, Servers[msg.guild.id].permission));
				break;

			case 'team':

				var guild = await bot.guilds.fetch(msg.guild.id);
				msg.channel.send(teamAPI(msg, args, Servers[msg.guild.id].team,  Servers[msg.guild.id].permission, guild));
				break;

			case 'task':
				msg.channel.send(taskAPI(msg, args, Servers[msg.guild.id].task,  Servers[msg.guild.id].permission, user));
			
			default:
				break;
		}
	});

	bot.on('guildCreate', (guild) => {
		guild.channels.create('memes', { //Create a channel
			type: 'text', //Make sure the channel is a text channel
			permissionOverwrites: [{ //Set permission overwrites
				id: guild.id,
				allow: ['VIEW_CHANNEL'],
			}],
			topic: 'Memes are fun and improve the mood. They do not increase procrastination levels, they do the exact opposite!'
		})
		.then((channel) => {
			global.memeChannels.add(guild.id, channel.id);
		})
		.catch(console.error);

		guild.channels.create('bot-commands', { //Create a channel
			type: 'text', //Make sure the channel is a text channel
			permissionOverwrites: [{ //Set permission overwrites
				id: guild.id,
				allow: ['VIEW_CHANNEL'],
			}],
			topic: 'You can send bot commands here. Everyone can mute this.'
		})
		.catch(console.error);

		Servers[guild.id] = {
			'permission': new PermissionManager(),
			'task': new TaskManager(),
			'team': new TeamManager()
		}

		Servers[guild.id].permission.setPermission(guild.ownerID, 'ADMIN');
	});
});

setInterval(()=> {
	fs.writeFile("bot_save.dat", JSON.stringify(Servers), (err) => {
		if(err)
			return console.log(err);
	});
}, 60 * 1000);