module.exports = b => {
	const memberRefernce = () => {
		const member = [];
		b.C.guilds.get(b.m.guild.id).members.array().forEach(v => {
			let user = b.C.guilds.get(b.m.guild.id).members.get(v.id);
			member.push({
				match: [
					encode(user.user.username),
					encode(user.displayName),
					`<@${user.user.id}>`,
					`${user.user.username}#${user.user.discriminator}`,
					user.user.id
				],
				score: 0,
				id: user.user.id
			});
		});
		return member;
	}
	
	userLength = b.params.length;
	if (!userLength)
		return "Too few arguements";


	return b.params.map(identify);

	function identify(query, i) {
		
		return memberRefernce().slice(0).map((v, j) => {
			let heru = v;
			v.match.forEach((k, jj) => {

				if (k.indexOf(query.toLowerCase()) !== -1) {
					heru.score += 5;
				}
				if (k.toLowerCase() === query.toLowerCase()) {
					heru.score += 50;
				}
				console.log(k, query)
			});
			return heru;
		}).sort((x, y) => y.score - x.score);

	}

}
function encode(a) {
	return a.replace(/ /gim, "%20").toLowerCase();
}