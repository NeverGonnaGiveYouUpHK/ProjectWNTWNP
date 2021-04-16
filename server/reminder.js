const Discord = require('discord.js');
const fs = require('fs/promises');

const priorityColors = ['#ee0000', '#fcac34', '#1cef5b'];

class Schedule {
	reminder = {};
	timeout = 0;

	constructor (reminder, timeout){
		//reminder: Reminder
		//timeout: number

		this.reminder = reminder;
		this.timeout = timeout;
	}
}

class Reminder {
	when = 0;		// timestamp when should notification be triggered
	text = '';
	priority = 0;	// 0 = high, 1 = medium, 2 = low
	wasScheduled = false;
	wasSent = false;

	constructor(when, text, priority){
		//when: number
		//text: string
		//priority: number

		this.when = when;
		this.text = text;
		this.priority = priority;
	}

	schedule(){
		//creates a schedule object from this Reminder
		this.wasScheduled = true;

		return new Schedule(this, this.when - Date.now());
	}
	
	send(){
		//creates a sendable Embed from the Reminder object
		this.wasSent = true;

		return new Discord.MessageEmbed()
		.addField('Reminder', this.text)
		.setColor(priorityColors[this.priorityColors]);
	}
}

module.exports = class ReminderManager { //anonymously manages reminders, attach to a user or save ID with it if needed
	notifications = []; //array that holds all reminders

	constructor(config){				
		//config?: object[]

		//may take an array from config or nothing - then notifications will be an empty array

		if (Array.isArray(config)){
			for (const reminder of config){
				this.notifications.push(
					new Reminder(
						reminder.when,
						reminder.text,
						reminder.priority
					)
				);
			}

			this.notifications = config;
		}
	}

	feedBefore(time){
		//time: number

		//locate and return all reminders that are due in less than time milliseconds as an array
		//once retrieved, they will be marked as already scheduled and won't be returned anymore by this method
		
		const now = Date.now();
		const max = now + time;

		let slice = [];

		for (var i = 0; i < this.notifications.length; i++){
			if (this.notifications[i].when > max){
				slice = this.notifications.slice(0, i);
				break;
			}
		}

		let result = [];

		for (const reminder of slice){
			if (!reminder.wasScheduled){
				result.push(reminder.schedule());
			}
		}

		return result;
	}

	add(when, text, priority){
		//when: number
		//text: string
		//priority: number

		//adds a new reminder for this manager object

		let start = 0;
		let end = this.notifications.length - 1;

		let index = null;

		while (start <= end){			//fancy binary search to determine where to insert the new reminder (ordered by time)
			const mid = Math.floor(start + (end - start) / 2);
			
			const current = this.notifications[mid].when;
			if (current === when){
				index = mid;
				break;
			} else if (current < when){
				start = mid + 1;
			} else {
				end = mid - 1;
			}
		}

		if (index === null){
			index = start;
		}

		//inserts the new Reminder to notifications array
		this.notifications.splice(index, 0, new Reminder(when, text, priority));
	}

	remove(inputIndex){
		//inputIndex: number (must be found in notifications array)

		//removes a reminder with a base-1 index

		const index = inputIndex - 1;

		//throw error if such index has no reminder
		if (this.notifications.length <= index || index < 0){
			throw new RangeError('Reminder with such index does not exist');
		}

		//execute the removal
		this.notifications.splice(index, 1);
	}

	toConfig(){
		//returns the saveable config
		//if you want to save the config to file, use save(path) instead

		return JSON.stringify(this.notifications);
	}
	
	cleanUp(){
		//deletes all already sent reminders

		for (var i = 0; i < this.notifications.length; i++){
			if (!this.notifications[i].wasSent){
				this.notifications.splice(0, i);
				break;
			}
		}
	}

	async save(path){
		//asynchronously create config and save to a file according to the specified path

		this.cleanUp();
		await fs.writeFile(path, this.toConfig());
	}
}