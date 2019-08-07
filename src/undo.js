module.exports = b => {
	b.m.channel.send({
		embed: {
			title: "Undo is best",
			description: "All hail Undo!",
			image: {
				url: b.m.author.avatarURL
			}
		}
	})
}