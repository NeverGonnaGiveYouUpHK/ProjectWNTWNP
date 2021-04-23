const Discord = require('discord.js');
const fs = require('fs/promises');

const defaults = [];

class Meme {
	link = '';

	constructor(link){
		this.link = link;
	}

	send(){
		return this.link;
	}
}

module.exports = class MemeManager {
	memes = []; //array that holds all links

	constructor(config = defaults){				
		//config?: string[]

		//may take an array from config or nothing - then links will be an empty array

		for (const link of config){
			this.memes.push(new Meme(link));
		}
	}

	add(link){
		//link: string

		//adds a new meme/link for this manager object

		this.memes.push(new Meme(link));
	}

	remove(inputIndex){
		//inputIndex: number (must be found in memes array)

		//removes a meme with a base-1 index

		const index = inputIndex - 1;

		//throw error if such index has no meme
		if (this.memes.length <= index || index < 0){
			throw new RangeError('Meme with such index does not exist');
		}

		//execute the removal
		this.memes.splice(index, 1);
	}

	feed(){
		if (this.memes.length === 0){
			throw new Error('We\'re out of memes! Give me more!');
		}

		return this.memes.shift();
	}

	toConfig(){
		//returns the saveable config
		//if you want to save the config to file, use save(path) instead

		const tempArray = [];

		for (const meme of this.memes){
			tempArray.push(meme.link);
		}

		return JSON.stringify(tempArray);
	}

	async save(path){
		//asynchronously create config and save to a file according to the specified path
		
		await fs.writeFile(path, this.toConfig());
	}
}