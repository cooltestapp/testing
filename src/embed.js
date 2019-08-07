module.exports = b => {
	try {
	let embed = JSON.parse(b.params.join(" ").replace(/\\`/gi, "`"));
	b.m.channel.send({embed:embed});
	} catch(e) {
		console.log(e);
		b.m.channel.send("error: invalid embed json object.")
	}
}