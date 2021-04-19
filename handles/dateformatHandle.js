const Discord = require('discord.js');

module.exports = async function reminderHandle(msg, user, args){
	const subcommand = args.shift();

	switch (subcommand){
		case 'display':
			msg.channel.send(
				new Discord.MessageEmbed()
				.addField(
					'Date Format Settings',
					`Your current date format settings are '${user.dateFormat.formatString === null ? 'default Date.parse (ISO and UTC format guaranteed to work)' : user.dateFormat.displayString}'`
				)
				.setColor('#fcac34')
			);

			break;

		case 'set':
			const inputString = args.join(' ').replace('\\', '');
			try {
				user.dateFormat.set(inputString)
			} catch (error){
				return msg.channel.send(
					new Discord.MessageEmbed()
					.addField('Wrong input error', error.message)
					.setColor('#fc1010')
				);
			}

			await user.dateFormat.save(`./config/data/dateformat/${user.id}.json`);
				
			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Success', `Your date format was set to ${user.dateFormat.displayString}.`)
				.setColor('#fcac34')
			);

			break;

		case 'test':
			const inputDate = args.join(' ');

			console.log(user.dateFormat.parse(inputDate));

			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Success', `Your input was interpreted as: ${new Date(user.dateFormat.parse(inputDate)).toUTCString()}.`)
				.setColor('#fcac34')
			);

			console.log(user.dateFormat);

			break;

		default:

			break;
	}
}