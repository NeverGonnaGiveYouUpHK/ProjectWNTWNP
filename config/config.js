const fs = require('fs/promises');

const ReminderManager = require('../server/reminder');

module.exports.User = class User {
	id = "";
	reminders;
	
	constructor(userID){
		this.id = userID;
	}

	async initialize(){
		try {
			const config = await fs.readFile(`./data/reminders/${this.id}.json`);
			const configParsed = JSON.parse(config);

			this.reminders = new ReminderManager(configParsed);
		} catch (error){
			this.reminders = new ReminderManager();
		}
		
	}
}