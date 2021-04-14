const fs = require('fs/promises');
const Permissions = require('../server/permissionManager');

class Config {
	id = null;
	users = Object.create(null);
	permissionManager = null;

	
	constructor(from){
		if (typeof from === "object"){
			this.id = from.id;
			this.users = from.users;
			this.permissionManager = new Permissions(from.permissions);
		}
	}


}
module.exports.Config = Config;

module.exports.loadServer = async function loadServer(guild){
	try {
		var contents = await fs.readFile(`./data/${guild.id}.json`, {encoding: 'utf-8'});
		contents = JSON.parse(contents);

		const config = new Config(contents);

		guild.config = config;
	} catch (error){
		return {
			success: false,
			error: error,
			config: null
		};
	}
}