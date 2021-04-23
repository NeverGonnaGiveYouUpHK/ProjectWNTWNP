const Discord = require('discord.js');
const crypto = require('crypto');

//Permission command callback.
//
//  Args: msg - Discord Message Object
//
//  Return: Embeded Message
module.exports = function(msg, args, teamHandler, permissionHandler) {

    var subcommand = args.shift();
    switch (subcommand) {
        
        case 'create':

            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result && !permissionHandler.hasPermissions(msg.member.id, 'MANAGE_TEAM').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var id;

            do {
                //Generate the random ID
                id = crypto.randomBytes(4).toString('hex');
            } while(teamHandler.teamExists(id));

            const originalText = args.join(' ');
            var creationResult = teamHandler.createTeam(id, originalText, msg.member.id);

            if(!creationResult.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid name or !");



            msg.guild.roles.create({
                data: {
                  name: originalText,
                  color: '#FCAC34',
                }
            }).then((res) => {
                teamHandler.saveTeamID(id, res.id, null, null);
              })
              .catch(console.error);

            msg.guild.channels.create(originalText, { //Create a channel
                type: 'voice', //Make sure the channel is a text channel
                permissionOverwrites: [{ //Set permission overwrites
                    id: msg.guild.id,
                    allow: ['VIEW_CHANNEL'],
                }]
            }).then((res) => {
                teamHandler.saveTeamID(id, null, res.id, null);
            }) 
            .catch(console.error);


            msg.guild.channels.create(originalText, { //Create a channel
                type: 'text', //Make sure the channel is a text channel
                permissionOverwrites: [{ //Set permission overwrites
                    id: msg.guild.id,
                    allow: ['VIEW_CHANNEL'],
                }]
            }).then((res) => {
                teamHandler.saveTeamID(id, null, null, res.id);
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

            var team = teamHandler.getTeam(args[0]);

            if (!team.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has already permissions set!");


            console.log(msg.mentions.users.first());
            //msg.mentions.users.first().roles.add(team.teamID);

            return new Discord.MessageEmbed()
            .setTitle("SettingSuccess!");

        case 'kick':
            if (handler.hasPermissions(callerID, 'ADMIN')) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var result = handler.kickFromTeam(args[0], msg.mentions.users.first());
            //Remove from role

            if (!result.success)return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid id provided or user isn't part of the team!");

        return new Discord.MessageEmbed()
        .setTitle("SettingSuccess!");
    }


    
}