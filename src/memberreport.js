const moment = require("moment");
module.exports = b => {
		let user = b.C.guilds.get(b.m.channel.guild.id).members.get(b.m.author.id);
		if (!user.hasPermission("ADMINISTRATOR")) {
			b.m.channel.send(`Sorry ${user.displayName}, you do not have sufficient permissions to use this command.`);
			return;
		}
		let range = parseInt(b.params[2]) || 30;

		let fromRange = parseInt(b.params[1]) ? parseInt(b.params[1]) - 1 : 0;

		let users = b.C.guilds.get(b.m.channel.guild.id).members.array();

		let roles = b.C.guilds.get(b.m.channel.guild.id).roles.array().map(v => 
			new Object({
				name: v.name.toLowerCase(),
				id: v.id
			}));

		let usersMod = require("./getUserModule2.js")(b);

		let userOrRole = null;

		let selectedRole = null;
		
		if (usersMod[0][0].score > 10) {
			if (b.params.length) {
				if (b.params[0].toLowerCase() !== "all") {
					userOrRole = usersMod[0][0].id;
				}
			}
			else {
				userOrRole = usersMod[0][0].id;
				console.log(usersMod, userOrRole);
			}
			
		}
		if (userOrRole === null) {
			if (b.params.length) {
				if (b.params[0].toLowerCase() !== "all") {
					selectedRole = !b.params.length ? undefined : roles.find(v => b.params[0].toLowerCase() === v.name);
					if (selectedRole !== undefined) {
						userOrRole = false;
					}
					else {
						userRole = null;
					}
				}
			}
			else {
				selectedRole = !b.params.length ? undefined : roles.find(v => b.params[0].toLowerCase() === v.name);
				if (selectedRole !== undefined) {
					userOrRole = false;
				}
				else {
					userRole = null;
				}
			}
		}

		let firstParam = b.params[0];

		let messages = new Array(users.length).fill(0).map((v, i) => {
			return users[i].lastMessage === null ? null : new Object({
				id: users[i].lastMessage.id,
				message: users[i].lastMessage.content.length >= 20 ? users[i].lastMessage.content.substr(0, 20) + "..." : users[i].lastMessage.content,
				userId: users[i].lastMessage.author.id,
				channelId: users[i].lastMessage.channel.id,
				lastSeen: users[i].lastMessage.createdTimestamp,
				index: i,
				messageId: users[i].lastMessage.id,
				roles: b.C.guilds.get(b.m.channel.guild.id).members.get(users[i].lastMessage.author.id).roles.array().map(v => v.id),
				isBot: users[i].lastMessage.author.bot
			});
		})
			.filter(v => v !== null)
			.sort((x, y) => y.lastSeen - x.lastSeen).slice(fromRange, range)
			.filter(v => userOrRole ? v.userId === userOrRole : true)
			.filter(v => userOrRole === false ? v.roles.some(k => k === selectedRole.id) : true)
			.filter(v => {
				if (v.isBot && userOrRole === null)
					return false;
				return true;
			});
		console.log(messages);
		const embed = {
				title: "Member report",
				description: `Logged in as \`${b.C.guilds.get(b.m.channel.guild.id).members.get(b.m.author.id).displayName.replace(/`/gi, "\'")}\` - \`Permission granted\`\n\n**Filter**: ${userOrRole===null?"None" : userOrRole===false?"Role":"User"}\n**Filter bots**: ${userOrRole===null?"True":"False"}\n**Range**: \`${fromRange + 1}\` - \`${range}\`\n__Usage__\n\`${b.a.prefix[0]}mr\` \`<role name | user | all>\` \`<int *from* (range)>\` \`<int *to* (range)>\`\n
		${!messages.length ? "**No results found**. try pinging, using exact name with # or using id. Role names have to be exact to work." : messages.map((v, i) => v === null ? "" : `**#${i+1}** <@${v.userId}> ~~**->**~~ **Last seen**: \`${moment.unix(v.lastSeen / 1000).startOf("minute").fromNow()}\`, **[Message](https://discordapp.com/channels/${b.m.channel.guild.id}/${v.channelId}/${v.messageId})**, **In**: <#${v.channelId}>`).join("\n")}
		`,
		color: 15868193
	}
	b.m.channel.send({
		embed: embed
	});
}