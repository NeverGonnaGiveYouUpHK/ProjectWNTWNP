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
            .addField("!dateformat", "Customize your date format.");
            break;

        case "permission":
            holder.addField("!permission get [user]", "Get permissions of a given user.")
            .addField("!permission give [user] [permission]", "Give permission to a user. Requires ADMIN permission. Valid permissions are: ADMIN, MANAGE_TEAM, MANAGE_TASK.")
            .addField("!permission revoke [user] [permission]", "Revoke user's permisssion. Requires ADMIN permission.Valid permissions are: ADMIN, MANAGE_TEAM, MANAGE_TASK.");
            break;

        case "team":
            holder.addField("!team create [name]", "Create team with given name. Requires ADMIN or MANAGE_TEAM permission.")
            .addField("!team assign [id] [user]", "Assign user to team. Requires ADMIN or MANAGE_TEAM permission.")
            .addField("!team kick [id] [user]", "Kick user from team. Requires ADMIN or MANAGE_TEAM permission.");
            break;

        case "task":
            holder.addField("!task create [deadline] [name]", "Create team with given name. Requires ADMIN or MANAGE_TASK permission. Name must be in new line!")
            .addField("!task list", "List all tasks you have assigned.")
            .addField("!task assign [id] [user]", "Assign user to a task. Requires ADMIN or MANAGE_TASK permission.")
            .addField("!task status [id] [status]", "Set status of a task. Requires ADMIN or MANAGE_TASK permission.")
            .addField("!task remove [id]", "Remove task. Requires ADMIN or MANAGE_TASK permission.");
            break;
    }

    return holder;
}
