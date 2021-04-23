const Discord = require('discord.js');

const tokenToName = {
	Y: 'year',
	M: 'month',
	D: 'day',
	h: 'hours',
	m: 'minutes',
	s: 'seconds'
};

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
			const inputString = args.join(' ').replace(/\\/g, '');
			let tokens;
			try {
				tokens = user.dateFormat.set(inputString);
			} catch (error){
				return msg.channel.send(
					new Discord.MessageEmbed()
					.addField('Wrong input error', error.message)
					.setColor('#fc1010')
				);
			}

			await user.dateFormat.save(`./config/data/dateformat/${user.id}.json`);
			
			for (var i = 0; i < tokens.length; i++){
				tokens[i] = tokenToName[tokens[i]];
			}

			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Success', `Your date format was set to ${user.dateFormat.displayString}.\nRecognizing ${tokens.join(', ')}.`)
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