const Url = require('url');

module.exports = (req) => {
	if (req.query !== undefined) {
		return req.query;
	}
	let { url } = req;
	let query = Url.parse(url, true).query;
	req.query = query;
	return query;
};
