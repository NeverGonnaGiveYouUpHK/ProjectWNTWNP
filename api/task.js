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
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var id;

            do {
                //Generate the random ID
                id = crypto.randomBytes(4).toString('hex');
            } while(taskHandler.taskExists(id));
            
			const originalText = args.join(' ');
			const originalSplit = originalText.split('\n');

            const date = originalSplit.shift();
			const text = originalSplit.join("\n");

            var creationResult = taskHandler.createTask(id, text, user.dateFormat.parse(date));

            if(!creationResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "An internal error occured. Please try again.");


            return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Task " + text + " succesfully created!", "ID: " + id + " Deadline: " + new Date(user.dateFormat.parse(date)).toUTCString());
        }     
            
        case 'list':
        {
            var listResult = taskHandler.getTasksByUser(msg.member.id);
            
            if(!listResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Internal error occured. Please try again.");

            if (Object.keys(listResult.result).length < 1) return new Discord.MessageEmbed()
            .setColor("#FCAC34")
            .addField("No tasks...", "You don't have any tasks assigned yet.");

            var embedMessages = [];

            for (var i = 0; i < Math.ceil(Object.keys(listResult.result).length / 20); i++) {
                embedMessages.push(new Discord.MessageEmbed().setColor("#FCAC34"));
            }

            var index = 0;

            for (const key of Object.keys(listResult.result)) {
                
                embedMessages[Math.floor(index / 20)].addField(listResult.result[key].name + " - " + listResult.result[key].status, "ID: " + key + " Deadline: " + new Date(listResult.result[key].deadline).toUTCString());
                index++;
            }

            for (var i = 0; i < embedMessages.length - 1; i++) {
                var message = embedMessages.shift();
                msg.channel.send(message);
            }
        
            return embedMessages[0];
        }

        case 'assign': 
        {
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");
         
            var assignResult = taskHandler.assignMember(args[0], msg.mentions.users.first().id);

            if(!assignResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid task id provided, or user is already assigned to that task!");

            return new Discord.MessageEmbed()
            .setColor("#FCAC34")
            .addField("Success!", "Successfully assigned <@" + msg.mentions.users.first().id + "> to task " + args[0]);
        }

        case 'status':
        {
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var id = args.shift();
            const originalText = args.join(' ');

            var setResult = taskHandler.setTaskStatus(id, originalText);

            if(!setResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid task id provided!");

            return new Discord.MessageEmbed()
            .setColor("#FCAC34")
            .addField("Success!", "Status set succesfully.");

        }

        case 'remove':
        {
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TASK').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var removeResult = taskHandler.removeTask(args[0]);

            if(!removeResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid task id provided!");

            return new Discord.MessageEmbed()
            .setColor("#FCAC34")
            .addField("Success!", "Task " + args[0] + " removed successfully.");
        }

        default:
            return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("An invalid argument for !task command provided: " + subcommand, "Use !help task to see the list of valid arguments.");
    }
}