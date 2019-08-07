const Entities = require('html-entities').Html5Entities;
const entities = new Entities();
const request = require("request");
module.exports = (b, author, anime, send) => {
	try {
	var embed = {
		title: `**${b.C.guilds.get(b.m.guild.id).members.get(author.id).displayName}** subscribed to **${entities.decode(anime)}**`,
		color: 15868193
	}
} catch(e){}

	// handle subscribe save

	//encodeURI('[{"a":"cool anime","u":2342345235232}]')
	if (!send)
		var d = [{u: author.id, a: entities.encodeNonASCII(anime), v: false}];
	else
		var d = send;

	return new Promise((resolve, reject) => {
		request.post({
			url: "https://animefrenzy.net/wp-includes/class-subscribe.php",
			form: {v: JSON.stringify(d)}
		}, (err, res, body) => {
			if(err)reject(err);

			resolve(!send?b.m.channel.send({embed: embed}):new Promise((resolve, reject) => resolve(true)));
		});
		
	});
}