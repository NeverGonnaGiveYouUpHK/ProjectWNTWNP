const Discord = require('discord.js');


//Permission command callback.
//
//  Args: msg - Discord Message Object
//
//  Return: Embeded Message
module.exports = function(msg, args, taskHandler, permissionHandler, user) {
    
    const subcommand = args.shift();
    
    switch (subcommand) {
        
        case 'create':

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

            //todo join
            //todo date
            var creationResult = taskHandler.createTask(id, text, user.dateFormat.parse(date));

            if(!creationResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid name or !");



        return "ASDQASD";
    
        case 'dump':
            console.log(teamHandler.getTaskObject());
            return "Dumping team object to debug console";

    }


    
}