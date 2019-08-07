const request = require("request");
module.exports = a => {
	return new Promise((resolve, reject) => {
		request(`https://animefrenzy.net/wp-admin/admin-ajax.php?action=dev_core_searchanime&query=${a}`, { json: true }, (err, res, body) => {
			if (err)reject(err);
			resolve(body);
		});
	});
}