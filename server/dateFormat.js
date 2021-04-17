const Discord = require('discord.js');
const fs = require('fs/promises');
const {sscanfSync} = require('nodejs-scanf');

const defaults = {
	displayString: '',
	formatString: null,
	items: []
}

module.exports = class DateFormatManager {
	displayString = '';
	formatString = null;
	items = [];
	
	constructor (config = defaults){
		this.displayString = config.displayString;
		this.formatString = config.formatString;
		this.items = config.items;
	}

	set(inputString){
		// inputString - string from user input
		// Use every symbol just once, so hh:mm:ss is invalid, correct is h:m:s

		let result = '';
		let items = [];

		for (var i = 0; i < inputString.length; i++){
			const char = inputString.charAt(i);

			// when symbol found, save it
			if (['Y', 'M', 'D', 'h', 'm', 's'].includes(char)){
				// check for duplicates
				if (items.includes(char)) throw new SyntaxError(`Repeated symbol - '${char}'`);

				items.push(char);
				result += '%d';
			} else {
				// just add the character we looked at
				result += char;
			}
		}

		this.displayString = inputString;
		this.formatString = result;
		this.items = items;
	}

	parse(inputString, timezone = '+00:00'){
		if (this.formatString !== null){
			// set defaults if numbers not provided
			
			const oneDayLater = new Date(Date.now() + 24 * 60 * 60 * 1000);
			
			// initialize with defaults
			const map = {
				Y: oneDayLater.getUTCFullYear(),
				M: oneDayLater.getUTCMonth() + 1,
				D: oneDayLater.getUTCDate(),
				h: oneDayLater.getUTCHours(),
				m: oneDayLater.getUTCMinutes(),
				s: 0
			};
			
			const numbers = sscanfSync(inputString, this.formatString);

			for (var i = 0; i < numbers.length && i < this.items.length; i++){
				map[this.items[i]] = numbers[i];
			}

			const strings = {
				Y: map.Y.toString(),
				M: map.M < 10 ? '0' + map.M.toString() : map.M.toString(),
				D: map.D < 10 ? '0' + map.D.toString() : map.D.toString(),
				h: map.h < 10 ? '0' + map.h.toString() : map.h.toString(),
				m: map.m < 10 ? '0' + map.m.toString() : map.m.toString(),
				s: map.s < 10 ? '0' + map.s.toString() : map.s.toString()
			};

			return Date.parse(`${strings.Y}-${strings.M}-${strings.D}T${strings.h}:${strings.m}:${strings.s}Z${timezone}`);
		} else {
			return Date.parse(inputString);
		}
	}

	toConfig(){
		//returns the saveable config
		//if you want to save the config to file, use save(path) instead

		return JSON.stringify({
			displayString: this.displayString,
			formatString: this.formatString,
			items: this.items
		});
	}

	async save(path){
		//asynchronously create config and save to a file according to the specified path

		await fs.writeFile(path, this.toConfig());
	}
}