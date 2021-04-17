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

	const userID = msg.author.id;
	let user;
	if (!users.has(userID)){
		user = new config.User(userID);
		await user.initialize();
		users.set(userID, user);
	} else {
		user = users.get(userID);
	}

	switch (subcommand){
		case 'add':
			const priority = args.shift().toLowerCase();
			const priorityNumber = priorities[priority];

			if (typeof priorityNumber === "undefined") return msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Wrong input error', 'Failed to recognize priority, should be either low, medium or high.')
				.setColor('#fc1010')
			);


			const originalText = args.join(' ');
			const originalSplit = originalText.split('\n');

			const date = originalSplit.shift();
			const text = originalSplit.join("\n");

			if (typeof text === "undefined") return msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Wrong input error', 'Found no text. Are you sure you put it in the new line?')
				.setColor('#fc1010')
			);

			const when = user.dateFormat.parse(date);
			if (Number.isNaN(when)) return msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Wrong input error', 'Unable to parse date. Even though the bot will understand some date formats, it doesn\'t recognize all. If no format works for you, the UTC and ISO formats will work always. You may also specify your own using !dateformat command. For help, see !dateformat help.')
				.setColor('#fc1010')
			);

			user.reminders.add(when, text, priorityNumber);

			await user.reminders.save(`./config/data/reminders/${userID}.json`);

			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Success', `Reminder set to ${new Date(when).toUTCString()}.`) //maybe once add timezone?
				.setColor('#fcac34')
			);

			break;
		
		case 'remove':

			break;

		case 'list':			
			msg.channel.send(listReminders(user.reminders.notifications, 0))
			.then((message) => {
				message.react("◀")
				.then(() => {
					message.react("▶")
					.then(() => {
						processPageMoves(message, user.reminders.notifications, 0)
					});
				});
			});

			break;

		default:

			break;
	}
}

// copypasta from biblebot, who knows how it works, but it works
function listReminders(notifications, page){
	const reply = new Discord.MessageEmbed()
	.setTitle("Listing set reminders...")
	.setFooter(`Page ${page + 1}/${Math.ceil(notifications.length / 10)}`)
	.setColor("#fcac34");
	
	for (var i = page * 10; i < (page + 1) * 10 && i < notifications.length; i++){
		const reminder = notifications[i];

		reply.addField(`${i + 1}. ${new Date(reminder.when).toUTCString()}`, reminder.text);
	}

	return reply;
}

function processPageMoves(message, notifications, page){
	let outerUser;
	const filter = (reaction, user) => {
		if (["◀", "▶"].includes(reaction.emoji.name) && !user.bot){
			outerUser = user;
			return true;
		} else {
			return false;
		}
	};

	message.awaitReactions(filter, {max: 1, time: 60000, errors: ["time"]})
	.then((collected) => {
		const reaction = collected.first();

		if (reaction.emoji.name === "◀") {
			if (page > 0){
				message.edit(listReminders(notifications, page - 1));
				processPageMoves(message, notifications, page - 1);
			} else {
				processPageMoves(message, notifications, page);
			}
		} else if (reaction.emoji.name === "▶"){
			if (page < Math.ceil(notifications.length / 10) - 1){
				message.edit(listReminders(notifications, page + 1));
				processPageMoves(message, notifications, page + 1);
			} else {
				processPageMoves(message, notifications, page);
			}
		}

		if (message.guild !== null){
			reaction.users.remove(outerUser);
		}
	})
	.catch(() => {

	});
}