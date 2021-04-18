const discord = require("discord.js");

module.exports = function(){
    var holder = new discord.MessageEmbed()  
    .setTitle("WNTWNP Bot command list: ")
    .setFooter("WNTWNP Bot by Never Gonna Give You Up")
    .setColor("#fcac34")

    .addField("!help", "Display help.")

    return holder;
}
