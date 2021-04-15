const Discord = require('discord.js');


//Permission command callback.
//
//  Args: msg - Discord Message Object
//
//  Return: Embeded Message
module.exports = function(callerID, targetID, subcommand, handler, permission) {

    switch (subcommand) {
        
        case 'get':

            if (callerID != targetID && !handler.hasPermissions(callerID, 'ADMIN')) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var permissionList = handler.getPermissions(userID);
            var embedMessage = new Discord.MessageEmbed()
            .setColor('#FCAC34')
            .setTitle(userID);


            for (const key of Object.keys(permissionList.result)) {
                if (permissionList[key])
                    embedMessage.addField("DEBUG ONLY!", key);
            }

        return embedMessage;
    
        case 'give':
            
            if (handler.hasPermissions(callerID, 'ADMIN')) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var result = handler.setPermission(userID, permission);

            if (!result.success)return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has already permissions set!");

        return new Discord.MessageEmbed()
        .setTitle("SettingSuccess!");


        case 'revoke':
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
        .setTitle("SettingSuccess!");
    }


    
}