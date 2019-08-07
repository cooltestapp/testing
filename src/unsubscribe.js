const request = require("request");
const cheerio = require("cheerio");
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();
module.exports = b => {
	function isValidURL(string) {
	  var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
	  return (res !== null)
	}
	if (!b.params.length) {

		let embed = {
			title: `**Unsubscribe**`,
			description: `**Usage**
\`\`\`yaml
${b.a.prefix[0]}${b.first} [anime name]
\`\`\`*or*
\`\`\`yaml
${b.a.prefix[0]}${b.first} [AnimeFrenzy.net anime URL]
\`\`\`**Example**
\`\`\`css
${b.a.prefix[0]}${b.first} sword art online
\`\`\`**Description**
Unsubscribe and don't recieve notification when a new episode is out.
`,
			color: b.color,
			footer: {
				icon_url: b.C.user.avatarURL,
				text: "AnimeFrenzy.net | .help"
			}
		}

		b.m.channel.send({embed: embed});
		return;
	}

	b.m.channel.send({
		embed: {
			title: "Searching...",
			color: b.color
		}
	}).then(m => {

		if (isValidURL(b.params.join(" "))) {
			if (!b.params.join(" ").toLowerCase().includes("animefrenzy.net") || !b.params.join(" ").toLowerCase().includes("http")) {
				let embed = {
					title: `**Invalid URL**`,
					description: "The provided URL is not valid. Please use a __working [AnimeFrenzy.net](https://animefrenzy.net/?ref=frenzy-chan) URL__.",
					color: b.color
				}
				m.delete().then(() => {
					b.m.channel.send({embed: embed});
				});

				return;
			}
			let embed = {
				title: `**Validating URL**`,
				color: b.color
			}
			b.m.channel.send({embed: embed}).then(msg => {
				request(b.params.join(" "), (err, res, body) => {
					m.delete().then((d) => console.log).catch(err => console.log);
					try {
						var $ = cheerio.load(body);
						var name = $(".infoboxc .entry-title").text();
					} catch(e) {}
					if (err || !name) {
						let embed = {
							title: `**Invalid URL**`,
							description: "The provided URL is not valid. Please use a __working [AnimeFrenzy.net](https://animefrenzy.net/?ref=frenzy-chan) URL__.",
							color: b.color
						}
						b.m.channel.send({embed: embed}).then(() => {
							try {
								msg.delete();
							} catch(e){}
						});
						return;
					} else {
						display(require("./searchSubscription.js")(name, b.m.author), msg);
					}
					
				});
			})
		}
		else {
			display(require("./searchSubscription.js")(b.params.join(" "), b.m.author))
		}
		function display(results, msg) {

			results.then(d => {
				try {
					m.delete().then((d) => console.log).catch(err => console.log);
				} catch(e){}
				let options = {
					o: {},
					b: b
				}
				d.suggestions.forEach((v, i) => {
					options.o[i+1] = v.value;	
				});

				let embed = {
				title: `**Subscription search results for **'${b.params.join(" ").slice(0, 1).toUpperCase() + b.params.join(" ").slice(1).toLowerCase()}'`,
					
					description: `I found \`${d.suggestions.length}\` results. Please send \`1\`-\`${d.suggestions.length}\` to choose which one you want\n${d.suggestions.map((v, i) => `\`${(i+1).toString().length==1?"0"+(i+1):(i+1)}\`. [${entities.decode(v.value)}](${v.url})`).join("\n")}`,
					footer: {
						icon_url: b.C.user.avatarURL,
						text: "AnimeFrenzy.net | .help"
					},
					color: b.color
				}
				if (d.suggestions[0].value === "No results") {
					embed.description = `I couldn't find any results for '${b.params.join(" ")}'.\n\n__How to get more results__\n\`1\`. Be less specific\n\`2\`. Use a different langauge version of the anime\n\`3\`. Avoid misspelling\n\`4\`. Check if you're subscribed to the anime with \`.sublist\``
					b.m.channel.send({embed: embed});
				}
				else {
					if (d.suggestions.length === 1) {
						try {
							msg.delete().then((d) => console.log).catch(err => console.log);
						}catch(e) {}
						success(d.suggestions[0].value);
					}
					else {
						b.m.channel.send({embed: embed}).then(m => {
							let pend = require("./pending.js");
							let res = pend.init(options);


							res.then(d => {
								m.delete();
								success(d);
							}).catch(data => {
								//console.log(d);
							});
						})
					}
					
				}
				
				function success(d) {
					if (d.length) {
						const unsubscribe = require("./unsubscribeUser")(b, b.m.author, d);
					} else {
						//fail
					}
				}

				
			});

		}		
		});
	
}