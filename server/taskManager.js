

module.exports = class TaskManager {

	constructor(taskObject) {

		if (taskObject !== undefined)
			this.#serverTasks = taskObject;
	}


	getTask(taskID) {

		if (typeof(taskID) !== 'string')
			return {
				'success': false,
				'result': 'taskID property is of invalid type (required: string)'
			};

		var task = this.#serverTasks[taskID];

		if (task === undefined)
			return {
				'success': false,
				'result': null
			};

		return {
			'success': true,
			'result': task
		};
	}

	createTask(taskID, name, deadline) {
		
		if (typeof taskID !== 'string' || Number.isNaN(deadline))
			return {
				'success': false,
				'result': 'taskID property is of invalid type (required: string)'
			};

		if (this.#serverTasks[taskID] !== undefined)
			return {
				'success': false,
				'result': null
			};

		this.#serverTasks[taskID] = {
			deadline: deadline,
			name: name,
			status: "Work In Progress",
			members: []
		};

		return {
			'success': true,
			'result': null
		};
	}

	getTasksByUser(userID) {

		var outArray = {};

		for (const key of Object.keys(this.#serverTasks)) {
			if (this.#serverTasks[key].members.indexOf(userID) != -1)
				outArray[key] = this.#serverTasks[key];
		}

		return {
			'success': true,
			'result': outArray
		};

	}

	setTaskStatus(taskID, status) {

		if (typeof(taskID) !== 'string')
			return {
				'success': false,
				'result': 'taskID property is of invalid type (required: string)'
			};

		if (this.#serverTasks[taskID] === undefined)
			return {
				'success': false,
				'result': null
			};

		this.#serverTasks[taskID].status = status;

		return {
			'success': true,
			'result': null
		};

	}

	assignMember(taskID, userID) {

		if (typeof(taskID) !== 'string')
		return {
			'success': false,
			'result': 'taskID property is of invalid type (required: string)'
		};

		if (this.#serverTasks[taskID] === undefined)
			return {
				'success': false,
				'result': null
			};

		if (this.#serverTasks[taskID].members.indexOf(userID) !== -1)
			return {
				'success': false,
				'result': null
			};
		
		this.#serverTasks[taskID].members.push(userID);
		return {
			'success': true,
			'result': this.#serverTasks[taskID]
		};
	}

	removeTask(taskID) {
		if (typeof(taskID) !== 'string')
			return {
				'success': false,
				'result': 'taskID property is of invalid type (required: string)'
			};

		if (this.#serverTasks[taskID] === undefined)
			return {
				'success': false,
				'result': null
			};
		
		delete this.#serverTasks[taskID];

		return {
			'success': true,
			'result': null
		};
	}

	taskExists(taskID) {

		if (this.#serverTasks[taskID] === undefined) return false;
		return true;
	}

	getTasksObject() {

		return {
			'success': true,
			'result': this.#serverTasks
		}
	}

	#serverTasks = {};
}