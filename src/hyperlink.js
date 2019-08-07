module.exports = b => {
	let user = b.C.guilds.get(b.m.channel.guild.id).members.get(b.m.author.id);
	if (!user.hasPermission("ADMINISTRATOR")) {
		b.m.channel.send(`Sorry ${user.displayName}, you do not have sufficient permissions to use this command.`);
		return;
	}

	const name = b.params[0];

	try {
		var link = b.params[1]
			.split(/\/|\?/)
			.filter(v => v.length === 18 && parseInt(v));
		}
	catch(err) {
		error("Too few arguements");
		return;
	}
	(async function() {
		try {
			var message = await b.C.guilds
				.get(link[0])
				.channels
				.get(link[1])
				.fetchMessage(link[2])
				.catch(err => error("Invalid message link.")) || null;
		}
		catch(err) {
			error("Invalid message link.");
			console.log(err)
			return;
		}
		
		if (!message) {
			error("Invalid message link.");
			console.log("1")
			return;
		}
		if (!name.length) {
			error("Invalid name.");
			return;
		}

		const embed = {
			description: `**[${name.replace(/%20/gi, " ")}](${b.params[1]})**`,
			color: 15868193
		}

		b.m.channel.send({embed:embed});
		b.m.delete();
	})();
	
	function error(msg) {
		b.m.channel.send({
			embed: {
				title: "**Error**",
				description: msg + "\n\n__Usage__\n\`!!hyperlink [name (use *%20* in place of *space*)] [message link]\`\n\n*this message will be deleted in 20 seconds.*",
				color: 15868193
			}
		}).then(m => {
			setTimeout(() => {
				m.delete();
			}, 20000)
		})
	}

}