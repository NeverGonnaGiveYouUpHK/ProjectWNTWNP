const Discord = require('discord.js');


//Permission command callback.
//
//  Args: msg - Discord Message Object, args - Command Arguments, permissionHandler - Permission Manager
//
//  Return: Embeded Message
module.exports = function(msg, args, permissionHandler) {

	switch (args[0]) {

		case 'get':
		{
			//Check, if user listing permissions is the user whose permissions are beeing listed, or has ADMIN permission
			if (msg.member.id != msg.mentions.users.first().id && !permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action!", "Higher permissions required!");

			//Check, if any user was provided via mentions
			if (msg.mentions.users.first() === undefined) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("No user specified!", "You need to mention a user if you want to get their permissions.");

			//Get list of user permissions
			var permissionList = permissionHandler.getPermissions(msg.mentions.users.first().id);
			
			//Create output EmbedMessage
			var embedMessage = new Discord.MessageEmbed()
			.setColor('#FCAC34')
			.setTitle("<@" + msg.mentions.users.first().id + ">");

			//Is user has no permissions, display it
			if (Object.keys(permissionList.result) < 1)
				embedMessage.addField("None!", "User has no permissions set.")

			//If they have, display them
			for (const key in permissionList.result) {
				if (permissionList.result[key]) 
					embedMessage.addField(key + " permission", "Set!");
			}

			//Return message
			return embedMessage;
		}

		case 'give':
		{
			
			//Check, if user has appropriate permissions
			if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Higher permissions required!");

			//Check if any user has been provided via mentions
			if (msg.mentions.users.first() === undefined) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("No user specified!", "You need to mention a user if you want to give them permissions.");
			
			//Check, if given permission is valid
			if (!permissionHandler.validPermissions.includes(args[2].toUpperCase()))return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Invalid permission string given!");

			//Try setting permission
			var giveResult = permissionHandler.setPermission(msg.mentions.users.first().id, args[2]);

			//If setting failed, send error message
			if (!giveResult.success)return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "User has already permissions set!");

			//Otherwise, display success message
			return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Success!", "Permission set successfully.");
		}

		case 'revoke':
		{
			//Check, if user has appropiate permissions
			if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Higher permissions required!");

			//Check, if user was supplied by mentions
			if (msg.mentions.users.first() === undefined) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("No user specified!", "You need to mention a user if you want to revoke their permissions.");

			//Try revoking permissions
			var revokeResult = permissionHandler.revokePermission(msg.mentions.users.first().id, args[2]);

			//If it failed, send error message
			if (!revokeResult.success)return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "User has no permissions set!");

			//Otherwise, display success message
			return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Success!", "Permission revoked successfully.");
		}

		default:
		{
			//If command is invalid, display the error
			return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("An invalid argument for !permission command provided: " + args[0], "Use !help permission to see the list of valid arguments.");
		}
	}	
}