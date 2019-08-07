module.exports = b => {
	const results = require("./search.js")(b.params.join(" "));

	results.then(d => {

		let embed = {
			title: `**Search results for **'${b.params.join(" ").slice(0, 1).toUpperCase() + b.params.join(" ").slice(1).toLowerCase()}'`,
			
			description: `${d.suggestions.map((v, i) => `\`${(i+1).toString().length==1?"0"+(i+1):(i+1)}\`. [${v.value}](${v.url})`).join("\n")}\n\n[Find out more about '${b.params.join(" ")}'](https://animefrenzy.net/?s=${encodeURI(b.params.join(" "))}).`,
			footer: {
				icon_url: b.C.user.avatarURL,
				text: "AnimeFrenzy.net | .help"
			},
			color: 15868193
		}
		if (d.suggestions[0].value === "No results") {
			embed.description = `I couldn't find any results for '${b.params.join(" ")}'.\n\n__How to get more results__\n\`1\`. Be less specific\n\`2\`. Use a different langauge version of the anime\n\`3\`. Avoid misspelling`
		}
		b.m.channel.send({embed: embed});
	});
}