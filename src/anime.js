const https = require("request");
const cheerio = require("cheerio");
module.exports = b => {
	const a = b.a;
	if (!b.params.length) {
			b.m.channel.send({
				embed: {
					title: "Anime search",
					description: `Hello ${b.m.guild.members.get(b.m.author.id).displayName}, to search for an anime type this: \`\`\`yaml\n${a.com}anime [anime title]\`\`\`or you can specify which search result to fetch with:\`\`\`yaml\n${a.com}anime [anime title] --[result_number]       \`\`\``,
					color: a.color,
				footer: {
					text: `${a.com}help`,
					icon_url: b.m.author.avatarURL
				}
				},
			});
			return;
		}
		function animeError(txt) {
			b.m.channel.send({
				embed: {
					title: "Error",
					description: "Message: " + txt,
					color: a.wcolor
				}
			});
		}
		let p = b.params.join(" ").toLowerCase() + " "
		let ep = p.match(/--(.*) /gim);
		if (ep) {
			ep.forEach((v, i) => {
				p = p.replace(v, "");
			});
		}
		try {
			ep = ep ? parseInt(ep[0].replace(/--| /gim, "")) : 0;
		} catch(e) {
			animeError("invalid result number");
			return;
		}
		if (isNaN(ep)) {
			animeError("invalid result number");
			return;
		}
		b.m.channel.send({
			embed: {
				author: {
					name: `MyAnimeList - Query ⇨ ${p}`,
					icon_url: b.m.author.avatarURL,
				},
				color: a.color
			}
		})
		let options = {
			url: `https://api.jikan.moe/v3/search/anime/?q=${p}&page=1`,
		    method: "GET",
		    headers: {
		        "Accept": 'application/json',
		    }
		};
		https(options, function(err, res, body) {
			if (err) {
				
				return;
			}
			const result = JSON.parse(body);
			let first = result.results[ep];
			try {
				getInfo(`https://api.jikan.moe/v3/anime/${first.mal_id}`);
			} catch(e) {animeError("could not find requested anime, try spelling it correctly.")}
		});


		function getInfo(url) {
			let options = {
				url: url,
			    method: 'GET',
			    headers: {
			        'Accept': 'application/json',
			    }
			};
			https(options, function(err, res, body) {
				const result = JSON.parse(body);
				//console.log(result);
				let embed = {
					title: `${result.title} (${result.title_japanese})` || "Unknown Title",
					fields: [
						{
							name: "Status",
							value: result.status || "N/A",
							inline: true
						},
						{
							name: "Duration",
							value: result.duration || "N/A",
							inline: true
						},
						{
							name: "Premiered",
							value: result.premiered || "N/A",
							inline: true
						},
						{
							name: "Popularity [MAL]",
							value: `#${niceNum(result.popularity)}` || "N/A",
							inline: true

						},
						{
							name: "Rank [MAL]",
							value: `#${niceNum(result.favorites)}` || "N/A",
							inline: true
						},
						{
							name: "Favorites [MAL]",
							value: niceNum(result.favorites) || "N/A",
							inline: true
						},
						{
							name: "Followers [MAL]",
							value: niceNum(result.members) || "N/A",
							inline: true
						},
						{
							name: "Score [MAL]",
							value: `${result.score} (by ${niceNum(result.scored_by)} users)` || "N/A",							
							inline: true
						},
						{
							name: "Aired",
							value: `from *${niceDate(result.aired.from)}* to *${niceDate(result.aired.to)}*` || "N/A",
							inline: true
						}
					],
					thumbnail: {
						url: result.image_url || ""
					},
					color: a.color || 0
				}

				if (result.synopsis.length >= 1000) {
					embed.description = result.synopsis.substr(0, 2040);
				}
				else {
					embed.fields.unshift({
							name: "Synopsis",
							value: result.synopsis || "N/A",
							inline: true
					});
				}
				function niceDate(date) {
					return new Date(date).getTime() === 0 ? "N/A" : new Date(date).toISOString().split("T")[0];
				}
				function niceNum(x) {
				    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				}
				b.m.channel.send({embed: embed});
			});	
		}
}