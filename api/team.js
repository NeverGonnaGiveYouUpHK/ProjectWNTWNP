const Discord = require('discord.js');


//Permission command callback.
//
//  Args: msg - Discord Message Object
//
//  Return: Embeded Message
module.exports = function(msg, args, teamHandler, permissionHandler) {

    switch (args[0]) {
        
        case 'create':

            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TEAM').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var creationResult = teamHandler.createTeam(args[1], msg.member.id);

            if(!creationResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid name or !");

            msg.guild.roles.create({
                data: {
                  name: args[1],
                  color: '#FCAC34',
                }
            }).then((res) => {
                teamHandler.saveTeamID(args[1], res.id, null);
              })
              .catch(console.error);

            msg.guild.channels.create(args[1], { //Create a channel
                type: 'text', //Make sure the channel is a text channel
                permissionOverwrites: [{ //Set permission overwrites
                    id: msg.guild.id,
                    allow: ['VIEW_CHANNEL'],
                }]
            }).then((res) => {
                teamHandler.saveTeamID(args[1], null, res.id);
            }) 
            .catch(console.error);



        return "ASDQASD";
    
        case 'dump':
            console.log(teamHandler.getTeamsObject());
            return "Dumping team object to debug console";


        case 'assign':
            
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            if (msg.mentions.users.first() === undefined) return new Discord.MessageEmbed()
                .setTitle("Sus u didnt provide a mention. Amogus!");

            var result = teamHandler.assignToTeam(args[1], msg.mentions.users.first().id);
    
            if (!result.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has already permissions set!");

            var team = teamHandler.getTeam(args[1]);

            if (!team.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has already permissions set!");


            console.log(msg.mentions.users.first());
            //msg.mentions.users.first().roles.add(team.teamID);

            return new Discord.MessageEmbed()
            .setTitle("SettingSuccess!");

        /*case 'kick':
            if (handler.hasPermissions(callerID, 'ADMIN')) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var result = handler.revokePermission(userID, permission);

            if (!result.success)return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has no permissions set!");

        return new Discord.MessageEmbed()
        .setTitle("SettingSuccess!");*/
    }


    
}