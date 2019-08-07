module.exports = b => {
	const embed = {
		title: "__**Help**__",
		description: `no help`,
		color: b.a.color
	}

	b.m.channel.send({
		embed: embed
	});
}