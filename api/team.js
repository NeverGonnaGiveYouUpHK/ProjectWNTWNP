const Discord = require('discord.js');
const crypto = require('crypto');

//Permission command callback.
//
//  Args: msg - Discord Message Object
//
//  Return: Embeded Message
module.exports = function(msg, args, teamHandler, permissionHandler, guild) {

    var subcommand = args.shift();
    switch (subcommand) {
        
        case 'create':
        {
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
            .addField("Unable to perform this action.", "Unable to create new team!");



            msg.guild.roles.create({
                data: {
                  name: originalText,
                  color: '#FCAC34',
                }
            }).then((res) => {
                teamHandler.saveTeamID(id, res, null, null);
                guild.members.cache.get(msg.member.id).roles.add(res);
            })
            .catch(console.error);

            msg.guild.channels.create(originalText, { //Create a channel
                type: 'voice', //Make sure the channel is a voice channel
                permissionOverwrites: [{ //Set permission overwrites
                    id: msg.guild.id,
                    allow: ['VIEW_CHANNEL'],
                }]
            }).then((res) => {
                teamHandler.saveTeamID(id, null, res, null);
            }) 
            .catch(console.error);


            msg.guild.channels.create(originalText, { //Create a channel
                type: 'text', //Make sure the channel is a text channel
                permissionOverwrites: [{ //Set permission overwrites
                    id: msg.guild.id,
                    allow: ['VIEW_CHANNEL'],
                }]
            }).then((res) => {
                teamHandler.saveTeamID(id, null, null, res);
            }) 
            .catch(console.error);


            return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Task " + originalText + " succesfully created!", "ID: " + id);
        }

        case 'assign':
            
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            if (msg.mentions.users.first() === undefined) return new Discord.MessageEmbed()
			.setTitle("Error!")
			.setColor("#FC1010")
			.addField("No user specified!", "You need to mention a user if you want to give them permissions.");

            var result = teamHandler.assignToTeam(args[0], msg.mentions.users.first().id);
    
            if (!result.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid ID provided or user is already part of the team");

            var team = teamHandler.getTeam(args[0]);

            if (!team.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Internal server error occured. Please try again.");

            guild.members.cache.get(msg.mentions.users.first().id).roles.add(team.result.teamID);

            return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Success!", "Successfully assigned <@" + msg.mentions.users.first().id + "> to team " + args[0]);

        case 'kick':
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN')) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var result = teamHandler.kickFromTeam(args[0], msg.mentions.users.first());

            if (!result.success)return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Invalid id provided or user isn't part of the team!");

            var team = teamHandler.getTeam(args[0]);

            if (!team.success) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has already permissions set!");

            guild.members.cache.get(msg.mentions.users.first().id).roles.remove(team.result.teamID);

            return new Discord.MessageEmbed()
			.setColor("#FCAC34")
			.addField("Success!", "Successfully kicked <@" + msg.mentions.users.first().id + "> to team " + args[0]);
    }


    
}