const request = require("request");
const cheerio = require("cheerio");
const _ = require("underscore");
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();

module.exports = a => {

	let xanimes = [];
	function getRecent() {

		let subsribeUpdate = [];
		request('https://animefrenzy.net/wp-includes/class-json.json', { json: true }, (err2, res2, body2) => {


			const u = body2;

			Object.keys(body2)
				.forEach((v, i) => {
					Object.entries(u[v]).forEach((k, j) => {
						delete u[v][k[0]];

						u[v][entities.decode(k[0])] = k[1];
					});
				});

			request('https://animefrenzy.net', { json: true }, (err, res, body) => {
			  if (err) { return console.log(err); }
			  
			  const $ = cheerio.load(body);

			  let animes = $(".maindark .iepbox .content_episode");

			  let collected = [];

			  animes.each(function(i) {
			  	const th = $(this);
			  	collected.push({
			  		name: th.find(".condd .cona:first-child").text(),
			  		dubbed: th.find("a.cona").text().slice(-6) == "Dubbed",
			  		poster: th.find(".coveri").attr("src"),
			  		date: th.find(".iepst3 .centerv").text(),
			  		recent: th.find(".iepst3 .centerv").attr("style") ? th.find(".iepst3 .centerv").attr("style").includes("#e61d2f") : false,
			  		link: th.find("a.cona").attr("href"),
			  		epLink: th.find(".iepsbox > a").attr("href"),
			  		episode: th.find(".iepst2 .centerv").text().trim(),
			  		genres: th.find(".con2").text().split(", "),
			  		genreLinks: th.find(".con2").text().split(", ").map(v => `https://animefrenzy.net/genre/${v.toLowerCase()}/`)
			  	});
			  });

			  let news = [];

			  collected.forEach(v => {
			  	let isnew = true;
			  	xanimes.forEach(k => {
			  		
			  		if (k.name + k.episode === v.name + v.episode) {
			  			isnew = false;
			  		}
			  	});
			  	if (isnew)
			  		news.push(v);
			  });

			  xanimes = collected.slice(0);

			  function send(arr, i = 0) {
			  	if (arr.length < 1) {
			  		setTimeout(() => {
	  					getRecent();
	  				}, 1000 * 60);
			  		return;
			  	}
			  	let anime = arr[i];
			  	let userSends = [];
			  	let embed = {
						title: `**${anime.name}**`,
						fields: [
							{
								name: anime.genres.length > 1 ? "Genres" : "Genre",
								value: anime.genres.map((v, i) => `[${v}](${encodeURI(anime.genreLinks[i].replace(/ /gi, "-"))})`).join(", "),
								inline: false
							}
						],
						thumbnail: {
							url: anime.poster
						},
						description: `[Episode ${anime.episode}](${encodeURI(anime.epLink)}) of [${anime.dubbed ? anime.name.slice(0, -6) : anime.name}](${encodeURI(anime.link)}) is out!`,
						footer: {
							icon_url: a.user.avatarURL,
							text: "Subscribe: `.sub "+anime.name+"` | .help | " + (!anime.recent ? `${anime.date} at ${new Date().toISOString().split("T")[0]}` : new Date().toISOString().split("T").join(" ").split(".")[0].slice(0, -3))
						},
						color: anime.dubbed ? 15868193 : 000000
					}
					const uentries = Object.entries(u)
					uentries.forEach((v, i) => {
						//if (v[1].constructor === Object.constructor)
						try {
							if (v[1][anime.name] || _.escape(v[1][anime.name])) {
								if (v[1][anime.name] === false || (isInteger(v[1][anime.name]) && v[1][anime.name] !== anime.episode)) {
									let newEmbed = embed;

									newEmbed.footer.text = "Unsubscribe: `.unsub "+anime.name+"` | .help | " + (!anime.recent ? `${anime.date} at ${new Date().toISOString().split("T")[0]}` : new Date().toISOString().split("T").join(" ").split(".")[0].slice(0, -3))
									userSends.push({
										u: v[0],
										e: newEmbed
									});
								}
							}
						} catch(e) {}
					});

			  	a
			  		.guilds
			  		.get("524715391512084492")
			  		.channels
			  		.get("600770389806678016")
			  		.send({
			  			embed: embed
			  		}).then(m => {
			  			if (i < arr.length - 1) {
			  				console.log("Notifying " + userSends.length + " users.");
			  				userSend(0, userSends);
			  				function userSend(j, arr2) {
			  					console.log(j, i, anime.name);
			  					let u = arr2[j];
			  					if (u && u.hasOwnProperty("u")) {
			  						let user = a.guilds.get("524715391512084492").members.get(u.u);
			  						user.send({embed: u.e}).then(m => {
			  							subsribeUpdate.push({
			  								u: user.id,
			  								a: entities.encodeNonASCII(anime.name),
			  								v: anime.episode
			  							});
			  							if (j < arr2.length - 1)
			  								userSend(j + 1, arr2);
			  							else
			  								send(arr, i + 1);
			  						});
			  					}
			  					else {
			  						if (j < arr2.length - 1)
		  								userSend(j + 1, arr2);
		  							else
		  								send(arr, i + 1);
			  					}

			  				}
			  			}
			  			else {
			  				
			  					const subscribe = require("./subscribeUser")(false, false, false, subsribeUpdate).then(() => {
			  						console.log("updated");
			  						setTimeout(() => {
			  							getRecent();
			  						}, 1000 * 60);
			  					});
			  					
			  				
			  				
			  			}



			  		});
			  }
			  send(news);
			  console.log(`Found ${news.length} animes to update`);

			});

		});

	}
	getRecent();
	
	

}