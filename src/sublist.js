

module.exports = b => {

	let user = b.C.guilds.get(b.m.guild.id).members.get(b.m.author.id);

	let code = user.id;

	b.m.channel.send({
		embed: {
			description: `**[Subscription list for ${user.displayName}](https://animefrenzy.net/wp-includes/list/?u=${code})**`,
			color: b.color
		}
	})

}