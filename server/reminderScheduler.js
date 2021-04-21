const users = global.users;
const bot = global.bot;

module.exports = function reminderScheduler(){
	setInterval(() => {
		for (const user of users.values()){
			let max = -Infinity;

			for (const schedule of user.reminders.feedBefore(20 * 1000)){
				if (schedule.timeout > max){
					max = schedule.timeout;
				}
				
				setTimeout(() => {
					bot.users.fetch(user.id)
					.then((userFetched) => {
						userFetched.send(
							schedule.reminder.send()
						);
					});
				}, schedule.timeout);
			}

			if (max !== -Infinity){
				setTimeout(() => {
					user.reminders.save(`./config/data/reminders/${user.id}.json`);
				}, max + 500);
			}
		}
	}, 20 * 1000);
}