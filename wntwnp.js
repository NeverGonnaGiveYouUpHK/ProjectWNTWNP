require('dotenv').config();

const Discord = require('discord.js');

const TOKEN = process.env.TOKEN;

const bot = new Discord.Client();
bot.login(TOKEN);

const prefix = "!";

bot.on('ready', () => {
	bot.on('message', (msg) => {
		if (!msg.content.startsWith(prefix)) return;
		
		const split = msg.content.split(' ');

		const commandWithPrefix = split[0];
		const command = commandWithPrefix.substring(prefix.length, commandWithPrefix.length)
		
		const args = split.slice(1, split.length);

		switch (command){
			case 'reminder':
				const subcommand = args[0];

				switch (subcommand){
					case 'add':
						
						break;
					
					case 'remove':
			
						break;
			
					case 'list':
			
						break;
			
					default:
						break;
				}
				break;
		

				
			default:
				break;
		}
	});
});