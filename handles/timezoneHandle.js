const Discord = require('discord.js');

module.exports = async function reminderHandle(msg, user, args){
	const subcommand = args.shift();

	switch (subcommand){
		case 'display':
			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Timezone Settings', `Your current timezone settings are GMT ${user.dateFormat.timezone}`)
				.setColor('#fcac34')
			);

			break;

		case 'set':
			const input = args[0];

			const sign = input.charAt(0);
			const hours = input.substring(1, 3);
			const colon = input.charAt(3);
			const minutes = input.substring(4, 6);

			const hoursNumber = Number(hours);
			const minutesNumber = Number(minutes);

			const errorEmbed =
			new Discord.MessageEmbed()
			.addField('Wrong input error', 'Invalid timezone offset format, use +HH:MM or -HH:MM. Also, you need to provide a timezone that has a chance to exist.')
			.setColor('#fc1010');

			if (colon !== ':') return msg.channel.send(errorEmbed);

			if (sign !== '+' && sign !== '-') return msg.channel.send(errorEmbed);
			if (!Number.isInteger(hoursNumber) || !Number.isInteger(minutesNumber)) return msg.channel.send(errorEmbed);
			
			if (sign === '+'){
				if (hoursNumber < 0 || hoursNumber > 14){
					return msg.channel.send(errorEmbed);
				}

				if (hoursNumber === 14 && minutesNumber !== 0){
					return msg.channel.send(errorEmbed);
				}
			} else {
				if (hoursNumber <= 0 || hoursNumber > 12){
					return msg.channel.send(errorEmbed);
				}

				if (hoursNumber === 12 && minutesNumber !== 0){
					return msg.channel.send(errorEmbed);
				}
			}
			
			if (minutesNumber < 0 || minutesNumber > 60 || minutesNumber % 15 !== 0) return msg.channel.send(errorEmbed);

			const hoursString = hoursNumber.toString();
			const minutesString = minutesNumber.toString();

			const finalString = `${sign}${hoursString.length === 2 ? hoursString : '0' + hoursString}:${minutesString.length === 2 ? minutesString : '0' + minutesString}`;

			user.dateFormat.timezone = finalString;

			msg.channel.send(
				new Discord.MessageEmbed()
				.addField('Success', `Your timezone was set to ${finalString}.`)
				.setColor('#fcac34')
			);

			break;

		default:

			break;
	}
}