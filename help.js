const discord = require("discord.js");

module.exports = function(args){
    var holder = new discord.MessageEmbed()  
    .setTitle("WNTWNP Bot command list: ")
    .setFooter("WNTWNP Bot by Never Gonna Give You Up")
    .setColor("#fcac34");

    switch (args[0]){
        case undefined:
            holder.addField("!help", "Display help.")
            .addField("!permission", "Display and set permissions.")
            .addField("!task", "Create and display tasks.")
            .addField("!team", "Create and manage teams.")
            .addField("!reminder", "Set and manage a reminders.")
            .addField("!timezone", "Set your timezone.")
            .addField("!dateformat", "Customize your date format.")
            break;
    }

    return holder;
}
