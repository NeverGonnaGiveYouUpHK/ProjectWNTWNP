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

module.exports.memes = async function (){
	try {
		const config = await fs.readFile(`./config/data/memes.json`);
		const configParsed = JSON.parse(config);

		return new MemeManager(configParsed);
	} catch (error){
		return new MemeManager();
	}
}

const defaults = [];

class guildChannelPair {
	guild = '';
	channel = '';

	constructor(config){
		this.guild = config.guild;
		this.channel = config.channel;
	}

	send(message){
		global.bot.guilds.fetch(this.guild)
		.then((guild) => {
			const channel = guild.channels.cache.get(this.channel);
			channel.send(message);
		})
		.catch(console.error);
	}
}

class MemeChannels {
	pairs = [];
	
	constructor(config = defaults){
		for (const pair of config){
			this.pairs.push(new guildChannelPair(pair));
		}
	}

	add(guild, channel){
		this.pairs.push(new guildChannelPair({
			guild: guild,
			channel: channel
		}));
		this.save('./config/data/memeChannels.json');
	}

	send(message){
		for (const pair of this.pairs){
			pair.send(message);
		}
	}

	async save(path){
		//asynchronously create config and save to a file according to the specified path

		await fs.writeFile(path, JSON.stringify(this.pairs));
	}
}

module.exports.memeChannels = async function (){
	try {
		const config = await fs.readFile(`./config/data/memeChannels.json`);
		const configParsed = JSON.parse(config);

		return new MemeChannels(configParsed);
	} catch (error){
		return new MemeChannels();
	}
}