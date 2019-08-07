const Entities = require('html-entities').Html5Entities;
const entities = new Entities();
module.exports = {
	init: async options => {
		return new Promise((resolve, reject) => {
			
			options.b.C.on("message", seek);
			let keys = Object.keys(options.o);
			let timer = setTimeout(xreject, 1000 * 60);
			function seek(m) {
				
				if (m.author.id === options.b.m.author.id && m.channel.id === options.b.m.channel.id) {
					
					let key = keys.find(v => options.b.a.prefix.some(k => m.content.slice(k.length) === v) || v === m.content);
					let cancel = options.b.a.prefix.some(k => m.content.slice(k.length).toLowerCase() === "cancel") || m.content.toLowerCase() === "cancel";

					if (cancel) {
						m.react("✅").then(() => {
							remove();
							reject("timeout");
							clearTimeout(timer);
						});
					}
					else if (key) {
						remove();
						resolve(options.o[key]);
						clearTimeout(timer);
					} else {
						options.b.m.channel.send({
							embed: {
								title: `**Error**`,
								description: `Unexpected arguement given:\nSaw '**${m.content.length > 30 ? m.content.slice(0, 30)+"...":m.content}**'. Expected: ${keys.slice(0).map((v, i) => {
									return (i != keys.length-1 ? `'**${v}**', ` : `or '**${v}**'`)
								}).join("")}. To cancel type \`cancel\``,
								color: options.b.color
							}
						});
					}
				}
			}
			
			function xreject() {
				options.b.m.channel.send({
					embed: {
						title: `**Arguement pending timed out at 60s**`,
						description: `Unexpected arguement given:\nSaw \`null\`. Expected: ${keys.slice(0).map((v, i) => {
									return (i != keys.length-1 ? `'**${v}**', ` : `or '**${v}**'.`)
								}).join("")}`,
						color: options.b.color
					}
				}).then(m => {
					remove();
					reject("timeout");
				});
			}
			function remove() {
				options.b.C.removeListener("message", seek);
			}
		});
		
	}
}