const D = require("discord.js");
const C = new D.Client();
const https = require("request");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const port = process.env.PORT || 1337;




app.listen(port, () => {
	console.log("Listening to port " + port);
});



C.login(process.env.TOKEN);


const a = {
	prefix: [";", "<@555414391378411530>%20", "<@555414391378411530>", "<@!555414391378411530>%20", "<@!555414391378411530>"],
	color: parseInt("0xE53232"),
	commands: [
		{
			permissions: "ADMINISTRATOR",
			catagory: {name: "admin", emoji: "", sub: {}},
			callback: "./src/embed.js",
			name: ["embed", "e"],
			description: ["Create embed"],
			usage: ""
		},
		{
			permissions: null,
			catagory: {name: "utility", emoji: "", sub: {}},
			callback: "./src/searchCmd.js",
			name: ["search", "searchanime"],
			description: ["Search on AnimeFrenzy.net"]
		},
		{
			permissions: null,
			catagory: {name: "utility", emoji: "", sub: {}},
			callback: "./src/anime.js",
			name: ["anime", "a"],
			description: ["Search anime"]
		},
		{
			permissions: null,
			catagory: {name: "info", emoji: "", sub: {}},
			callback: ["./src/1ckle.js"],
			name: ["1ckle"],
			description: [""]
		},
		{
			permissions: null,
			catagory: {name: "info", emoji: "", sub: {}},
			callback: "./src/website.js",
			name: ["website", "site", "link"],
			description: ["Display website url"]
		},
		{
			permissions: null,
			callback: "./src/discord.js",
			catagory: {name: "info", emoji: "", sub: {}},
			name: ["discord", "d"],
			description: ["Discord invite link"]
		},
		{
			permissions: null,
			callback: "./src/help.js",
			catagory: {name: "info", emoji: "", sub: {}},
			name: ["help", "h"],
			description: ["Help menu."]
		},
		{
			permissions: "ADMINISTRATOR",
			catagory: {name: "utility", emoji: "", sub: {}},
			callback: "./src/memberreport.js",
			name: ["memberreport", "mr"],
			description: ["Help menu."]
		},
		{
			permissions: "ADMINISTRATOR",
			catagory: {name: "utility", emoji: "", sub: {}},
			callback: "./src/hyperlink.js",
			name: ["hyperlink"],
			description: ["Create hyper link, takes in name and message link."]
		},
		{
			permissions: null,
			catagory: {name: "utility", emoji: "", sub: {}},
			callback: "./src/subscribe.js",
			name: ["sub", "subscribe"],
			description: [""]
		},
		{
			permissions: null,
			catagory: {name: "utility", emoji: "", sub: {}},
			callback: "./src/unsubscribe.js",
			name: ["unsub", "unsubscribe"],
			description: [""]
		},
		{
			permissions: null,
			catagory: {name: "utility", emoji: "", sub: {}},
			callback: "./src/sublist.js",
			name: ["sublist", "list", "subribtionlist"],
			description: [""]
		},
	]
}

C.on("ready", a => {
	let y = [
		{name: "anime on AnimeFrenzy.net | .help", options: { type: 'WATCHING', url: "https://animefrenzy.net" }},
		{name: "Undo-sama | .help", options: { type: 'LISTENING', url: "https://animefrenzy.net" }},
		{name: "over my otakus <3 | .help", options: { type: 'WATCHING', url: "https://animefrenzy.net" }},
		{name: "video games | .help", options: { type: 'PLAYING', url: "https://animefrenzy.net" }}
	];
	r(0);
	function r(i) {
		let u = y[i];

		C.user.setActivity(u.name, u.options)
			.then(presence => {
				setTimeout(() => {
					r(i == y.length - 1 ? 0 : i + 1);
				}, 1000*40);
			})
			.catch(console.log);

		  
	}
	//equire("./src/looper.js")(C);

	app.get('/af-members', (req, res) => res.send(JSON.stringify({
		status: "success",
		code: 200,
		data: {
			members: C.guilds.get("524715391512084492").memberCount
		}
	})));

});


C.on("message", m => {
	

	if (m.channel.id === "608362198372450324") {
		if (m.id !== "608362299438137384") {
			setTimeout(() => {
				m.delete();
			}, 1000*60);
		}
	}


	const c = m.content;
	const prefix = a.prefix.slice(0).sort((x, y) => y.length - x.length).find(v => c.replace(/ /gi, "%20").indexOf(v) === 0);
	if (prefix) {
		const command = c.replace(/ /gi, "%20").slice(prefix.length).split("%20")[0];
		const cmd = a.commands.find(v => v.name.some(k => k === command));
		const b = {
			params: c.replace(/ /gi, "%20").slice(prefix.length).split("%20").slice(1),
			c: c,
			first: command,
			command: cmd,
			a: a,
			color: 15868193,
			m: m,
			C: C
		}
		if (m.author.id !== "246660882803720193") {
			//m.channel.send("You do not have permissions to use this bot. Contact \`Undo#7742\` if you believe this is an error");
			//return;
		}
		try {
		require(cmd.callback)(b);
		}
		catch(err) {
			console.log(err)
		}
	}

});

