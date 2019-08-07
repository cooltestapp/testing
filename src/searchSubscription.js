const request = require("request");
const cheerio = require("cheerio");
const Entities = require('html-entities').Html5Entities;
const entities = new Entities();
const FlexSearch = require("flexsearch");

module.exports = (a, author) => {
	return new Promise((resolve, reject) => {
		request(`https://animefrenzy.net/wp-includes/class-json.json`, { json: true }, (err, res, body) => {
			if (err)reject(err);
			//console.log({suggestions: Object.entries(body[author.id]).map((v, i) => ({value: v[0]}))});
			const index = new FlexSearch("memory", {
			    encode: "balance",
			    tokenize: "forward",
			    threshold: 0
			});
			
			Object.keys(body[author.id]).forEach((v, i) => {
				index.add(i, v);
			});

			const found = index.search(a, 12).map(v => ({ value: Object.keys(body[author.id])[v]}));
			resolve(found.length ? {suggestions: found} : {suggestions: [{value: "No results"}]});
		});
	});
}