const Discord = require('discord.js');
const crypto = require('crypto');

//Permission command callback.
//
//  Args: msg - Discord Message Object
//
//  Return: Embeded Message
module.exports = function(msg, args, taskHandler, permissionHandler, user) {
	
	const subcommand = args.shift();
	
	switch (subcommand) {
		
		case 'create':
		{
			//Check if user has appropriate permissions
			if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Higher permissions required!");

			//Get new id of the task
			var id;
			do {
				//Generate the random ID
				id = crypto.randomBytes(4).toString('hex');
			} while(taskHandler.taskExists(id));
			
			//Parse out date and name
			const originalText = args.join(' ');
			const originalSplit = originalText.split('\n');

			const date = originalSplit.shift();
			const text = originalSplit.join("\n");

			//Handle invalid date and name text
			if (date === undefined || text === undefined) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Invalid input! Use !help task for more info!");

			//Try creating task
			var creationResult = taskHandler.createTask(id, text, user.dateFormat.parse(date));

			//If it failed, display error message
			if(!creationResult.success) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "An internal error occured. Please try again.");

			//Otherwise, display success message
			return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Task " + text + " succesfully created!", "ID: " + id + " Deadline: " + new Date(user.dateFormat.parse(date)).toUTCString());
		}     
			
		case 'list':
		{
			//Get all tasks of user
			var listResult = taskHandler.getTasksByUser(msg.member.id);
			
			//If it failed, display error message
			if(!listResult.success) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Internal error occured. Please try again.");

			//If user has no task assigned, display the message
			if (Object.keys(listResult.result).length < 1) return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("No tasks...", "You don't have any tasks assigned yet.");

			//Create all Embeds (one can hold only up to 20 fields)
			var embedMessages = [];
			for (var i = 0; i < Math.ceil(Object.keys(listResult.result).length / 20); i++) {
				embedMessages.push(new Discord.MessageEmbed().setColor("#FCAC34"));
			}

			//Assign all fields to embeds
			var index = 0;
			for (const key of Object.keys(listResult.result)) {
				embedMessages[Math.floor(index / 20)].addField(listResult.result[key].name + " - " + listResult.result[key].status, "ID: " + key + " Deadline: " + new Date(listResult.result[key].deadline).toUTCString());
				index++;
			}

			//Send all messages, except the last
			for (var i = 0; i < embedMessages.length - 1; i++) {
				var message = embedMessages.shift();
				msg.channel.send(message);
			}
			
			//Return last message
			return embedMessages[0];
		}

		case 'assign': 
		{
			 //Check if user has appropriate permissions
			if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Higher permissions required!");

			//Check if any user has been provided via mentions
			if (msg.mentions.users.first() === undefined) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("No user specified!", "You need to mention a user if you want to give them permissions.");
		 
			//Try assigning task to the specified user
			var assignResult = taskHandler.assignMember(args[0], msg.mentions.users.first().id);

			//If it fails, display error message
			if(!assignResult.success) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Invalid task id provided, or user is already assigned to that task!");

			//When assigned to task, also set reminder
			user.reminders.add(assignResult.result.deadline, "Deadline: " + assignResult.result.name, 1);

			//Return success
			return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Success!", "Successfully assigned <@" + msg.mentions.users.first().id + "> to task " + args[0]);
		}

		case 'status':
		{
			//Check if user has appropriate permissions
			if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Higher permissions required!");

			//Prepare params for setStatus Call
			var id = args.shift();
			const originalText = args.join(' ');

			//Try setting status
			var setResult = taskHandler.setTaskStatus(id, originalText);

			//If it fails, display error message
			if(!setResult.success) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Invalid task id provided!");

			//Return success
			return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Success!", "Status set succesfully.");

		}

		case 'remove':
		{
			//Check if user has appropriate permissions
			if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Higher permissions required!");

			var removeResult = taskHandler.removeTask(args[0]);

			//If it fails, display error message
			if(!removeResult.success) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("Unable to perform this action.", "Invalid task id provided!");

			//Return success
			return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Success!", "Task " + args[0] + " removed successfully.");
		}

		default:
			//If invalid arg is passed, display error message
			return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("An invalid argument for !task command provided: " + subcommand, "Use !help task to see the list of valid arguments.");
	}
}