const fs = require('fs/promises');

const ReminderManager = require('../server/reminder');
const DateFormatManager = require('../server/dateFormat');

module.exports.User = class User {
	id = "";
	reminders;
	dateFormat = null;
	
	constructor(userID){
		this.id = userID;
	}

	async initialize(){
		//load reminders
		try {
			const config = await fs.readFile(`./config/data/reminders/${this.id}.json`);
			const configParsed = JSON.parse(config);

			console.log(configParsed);

			this.reminders = new ReminderManager(configParsed);
		} catch (error){
			console.log(error);
			this.reminders = new ReminderManager();
		}
		
		//load dateformat
		try {
			const config = await fs.readFile(`./config/data/dateformat/${this.id}.json`);
			const configParsed = JSON.parse(config);

			this.dateFormat = new DateFormatManager(configParsed);
		} catch (error){
			this.dateFormat = new DateFormatManager();
		}
	}
}