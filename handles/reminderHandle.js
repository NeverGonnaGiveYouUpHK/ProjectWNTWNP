const Discord = require('discord.js');
const config = require('../config/config');

const users = global.users;
const bot = global.bot;

const priorities = {
	high: 0,
	medium: 0,
	low: 0
};



module.exports = async function reminderHandle(msg, args){
	const subcommand = args.shift();

	switch (subcommand){
		case 'add':
			const priority = args.shift().toLowerCase();
			const priorityNumber = priorities[priority];

			const originalText = args.join(' ');
			const [date, text] = originalText.split('\n');

			const when = Date.parse(date);
			if (Number.isNan(when.valueOf())) return msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Wrong input error', 'Unable to parse date. Even though the bot will understand many date formats, it doesn\'t know all. If no format works for you, the UTC and ISO formats will work always.')
				.setColor('#fc1010')
			);

			const userID = msg.author.id;

			if (!users.has(userID)){
				const user = new config.User(userID);
				await user.initialize();
				users.set(userID, user);
			}

			users.get(userID).reminders.add();

			break;
		
		case 'remove':

			break;

		case 'list':

			break;

		default:

			break;
	}
	break;
}