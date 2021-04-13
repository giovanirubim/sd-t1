const Url = require('url');

module.exports = (req) => {
	if (req.parsed_query !== undefined) {
		return req.parsed_query;
	}
	let { url } = req;
	let query = Url.parse(url, true).query;
	req.parsed_query = query;
	return query;
};
