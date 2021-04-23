const Discord = require('discord.js');

const config = require('../config/config');
const memes = config.meme();

module.exports = async function reminderHandle(msg, user, args){
	const subcommand = args.shift();

	switch (subcommand){
		case 'add':
			const messageText = args.join(' ');

			if (messageText === '') return msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Wrong input error', 'No meme?')
				.setColor('#fc1010')
			);

			memes.add(messageText);

			await memes.save(`./config/data/memes.json`);

			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Success', `Meme added.`) //maybe once add timezone?
				.setColor('#fcac34')
			);

			break;

		case 'remove':
			const removeIndex = Number(args[0]);

			if (!Number.isInteger(removeIndex)) return msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Wrong input error', 'Found no number of a meme to be removed (It must be a positive integer).')
				.setColor('#fc1010')
			);

			try {
				memes.remove(removeIndex);
			} catch (error){
				return msg.channel.send(
					new Discord.MessageEmbed()
					.addField('Error', `Meme with number ${removeIndex} doesn't exist.`)
					.setColor('#fc1010')
				)
			}

			await memes.save(`./config/data/memes.json`);

			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Success', `Meme removed successfully.`)
				.setColor('#fcac34')
			);

			break;

		case 'list':			
			msg.channel.send(listMemes(memes.links, 0))
			.then((message) => {
				message.react('◀')
				.then(() => {
					message.react('▶')
					.then(() => {
						processPageMoves(message, memes.links, 0);
					});
				});
			});

			break;
	}
}

// copypasta from biblebot, who knows how it works, but it works
function listMemes(memesList, page){
	const reply = new Discord.MessageEmbed()
	.setTitle('Listing memes in the stack...')
	.setFooter(`Page ${page + 1}/${Math.ceil(memesList.length / 10)}`)
	.setColor('#fcac34');
	
	for (var i = page * 10; i < (page + 1) * 10 && i < memesList.length; i++){
		const meme = memesList[i];

		reply.addField(`${i + 1}.`, meme.link);
	}

	return reply;
}

function processPageMoves(message, memesList, page){
	let outerUser;
	const filter = (reaction, user) => {
		if (['◀', '▶'].includes(reaction.emoji.name) && !user.bot){
			outerUser = user;
			return true;
		} else {
			return false;
		}
	};

	message.awaitReactions(filter, {max: 1, time: 60000, errors: ['time']})
	.then((collected) => {
		const reaction = collected.first();

		if (reaction.emoji.name === '◀') {
			if (page > 0){
				message.edit(listReminders(memesList, page - 1));
				processPageMoves(message, memesList, page - 1);
			} else {
				processPageMoves(message, memesList, page);
			}
		} else if (reaction.emoji.name === '▶'){
			if (page < Math.ceil(memesList.length / 10) - 1){
				message.edit(listReminders(memesList, page + 1));
				processPageMoves(message, memesList, page + 1);
			} else {
				processPageMoves(message, memesList, page);
			}
		}

		if (message.guild !== null){
			reaction.users.remove(outerUser);
		}
	})
	.catch(() => {

	});
}