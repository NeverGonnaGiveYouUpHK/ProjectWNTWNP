


module.exports = class TeamManager {


    constructor(teamObject) {

        if (teamObject !== undefined)
            this.#serverTeams = teamObject;
    }

    createTeam(teamID, name, userID) {


        if (typeof(teamID) !== 'string')
            return {
                'success': false,
                'result': 'teamID property is of invalid type (required: string)'
            };

        if (this.#serverTeams[teamID] !== undefined)
            return {
                'success': false,
                'result': null
            };

            
        this.#serverTeams[teamID] = {

            'admin': userID,
            'name': name,
            'members': []
        };

        return {
            'success': true,
            'result': name
        };
    }

    assignToTeam(teamID, userID) {

        if (typeof(teamID) !== 'string')
            return {
                'success': false,
                'result': 'teamID property is of invalid type (required: string)'
            };

        var team = this.#serverTeams[teamID];

        if (team === undefined)
            return {
                'success': false,
                'result': 'Requested team does not exist'
            };

        if (team.admin == userID || team.members.includes(userID)) 
            return {
                'success': false,
                'result': 'User aleready assigned to team'
            };

        team.members.push(userID);
        this.#serverTeams[teamID] = team;

        return {
            'success': true,
            'result': userID
        };  
    }

    kickFromTeam(teamID, userID) {

        if (typeof(teamID) !== 'string')
            return {
                'success': false,
                'result': 'teamID property is of invalid type (required: string)'
            };


        var team = this.#serverTeams[teamID];

        if (team === undefined)
            return {
                'success': false,
                'result': 'Requested team does not exist'
            };

        if (team.admin == userID || team.members.includes(userID)) 
            return {
                'success': false,
                'result': 'User aleready assigned to team'
            };

        team.members.splice(team.members.indexOf(userID, 1));
        this.#serverTeams[teamID] = team;

        return {
            'success': true,
            'result': userID
        };  
    }

    getTeam(teamID) {

        if (typeof(teamID) !== 'string')
            return {
                'success': false,
                'result': 'teamID property is of invalid type (required: string)'
            };

        var team = this.#serverTeams[teamID];

        if (team === undefined)
            return {
                'success': false,
                'result': null
            };

        return {
            'success': true,
            'result': team
        };
    }

    deleteTeam(teamID) {

        if (typeof(teamID) !== 'string')
            return {
                'success': false,
                'result': 'teamID property is of invalid type (required: string)'
            };

        if (this.#serverTeams[teamID] === undefined)
            return {
                'success': false,
                'result': 'Requested team does not exist'
            };

        delete this.#serverTeams[teamID];

        return {
            'success': true,
            'result': null
        };
    }

    saveTeamID(teamID, dscTeamID, dscVChannelID, dscTChannelID) {
        
        if(dscVChannelID != null)
            this.#serverTeams[teamID].vchannelID = dscVChannelID;
        if(dscTChannelID != null)
            this.#serverTeams[teamID].tchannelID = dscTChannelID;
        if(dscTeamID != null)
            this.#serverTeams[teamID].teamID = dscTeamID;

        return {
            'success': true,
            'result': null
        };
    }

    teamExists(teamID) {

		if (this.#serverTeams[teamID] === undefined) return false;
		return true;
	}

    getTeamsObject() {

        return {
            'success': true,
            'result': this.#serverTeams
        }
    }

    #serverTeams = {};
    
}