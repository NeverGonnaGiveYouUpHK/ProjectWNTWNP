const fs = require('fs/promises');

const ReminderManager = require('../server/reminder');
const DateFormatManager = require('../server/dateFormat');
const MemeManager = require('../server/meme');

module.exports.User = class User {
	id = '';
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

			this.reminders = new ReminderManager(configParsed);
		} catch (error){
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

module.exports.meme = function (){
	try {
		const config = await fs.readFile(`./config/data/memes.json`);
		const configParsed = JSON.parse(config);

		return new MemeManager(configParsed);
	} catch (error){
		return new MemeManager();
	}
}