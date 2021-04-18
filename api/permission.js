const Discord = require('discord.js');


//Permission command callback.
//
//  Args: msg - Discord Message Object
//
//  Return: Embeded Message
module.exports = function(msg, args, permissionHandler) {
 
    if (msg.mentions.users.first() === undefined) return new Discord.MessageEmbed()
            .setTitle("Sus u didnt provide a mention. Amogus!");

    switch (args[0]) {

        case 'get':
            

            if (msg.member.id != msg.mentions.users.first().id && !permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var permissionList = permissionHandler.getPermissions(msg.mentions.users.first().id);
            var embedMessage = new Discord.MessageEmbed()
            .setColor('#FCAC34')
            .setTitle(msg.mentions.users.first().id);


            for (const key in permissionList.result) {
                if (permissionList.result[key]) 
                    embedMessage.addField("DEBUG ONLY!", key);
            }

        return embedMessage;
    
        case 'give':
            
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");


            var result = permissionHandler.setPermission(msg.mentions.users.first().id, args[2]);

            if (!result.success)return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has already permissions set!");

        return new Discord.MessageEmbed()
        .setTitle("SettingSuccess!");


        case 'revoke':
            if (!permissionHandler.hasPermissions(msg.member.id, 'ADMIN').result) return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "Higher permissions required!");

            var result = permissionHandler.revokePermission(msg.mentions.users.first().id, args[2]);

            if (!result.success)return new Discord.MessageEmbed()
            .setTitle("Error!")
            .setColor("#FC1010")
            .addField("Unable to perform this action.", "User has no permissions set!");

        return new Discord.MessageEmbed()
        .setTitle("SettingSuccess!");

        case 'dump':
            console.log(permissionHandler.getPermissionsObject());
            return "Dumping permission object to debug console";


        default:
            return new Discord.MessageEmbed()
            .setTitle("Sus u didnt provide a subcomand. Amogus!");
    }


    
}