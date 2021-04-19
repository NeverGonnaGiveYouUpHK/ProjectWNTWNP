


module.exports = class TeamManager {


    constructor(teamObject) {

        if (teamObject !== undefined)
            this.#serverTeams = teamObject;
    }

    createTeam(name, userID) {

        if (typeof(name) !== 'string')
            return {
                'success': false,
                'result': null
            };


        if (this.#serverTeams[name] !== undefined)
            return {
                'success': false,
                'result': null
            };

            
        this.#serverTeams[name] = {

            'admin': userID,
            'members': []
        };

        return {
            'success': true,
            'result': name
        };
    }

    assignToTeam(name, userID) {

        if (typeof(name) !== 'string')
            return {
                'success': false,
                'result': 'NAME property is of invalid type (required: string)'
            };

        var team = this.#serverTeams[name];

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
        this.#serverTeams[name] = team;

        return {
            'success': true,
            'result': userID
        };  
    }

    kickFromTeam(name, userID) {

        if (typeof(name) !== 'string')
            return {
                'success': false,
                'result': 'NAME property is of invalid type (required: string)'
            };

        var team = this.#serverTeams[name];

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
        this.#serverTeams[name] = team;

        return {
            'success': true,
            'result': userID
        };  
    }

    getTeam(name) {

        if (typeof(name) !== 'string')
            return {
                'success': false,
                'result': null
            };

        var team = this.#serverTeams[name];

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

    deleteTeam(name) {

        if (typeof(name) !== 'string')
            return {
                'success': false,
                'result': 'NAME property is of invalid type (required: string)'
            };

        if (this.#serverTeams[name] === undefined)
            return {
                'success': false,
                'result': 'Requested team does not exist'
            };

        delete this.#serverTeams[name];

        return {
            'success': true,
            'result': null
        };
    }

    saveTeamID(name, dscTeamID, dscChannelID) {
        
        if(dscChannelID != null)
            this.#serverTeams[name].channelID = dscChannelID;
        if(dscTeamID != null)
            this.#serverTeams[name].teamID = dscTeamID;

        return {
            'success': true,
            'result': null
        };
    }

    getTeamsObject() {

        return {
            'success': true,
            'result': this.#serverTeams
        }
    }

    #serverTeams = {};
    
}