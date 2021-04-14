const parseBody = require('./parse-body');
const parseQuery = require('./parse-query');

const endpointMap = {};
const getEndpoint = (method, url) => {
	return method.toUpperCase() + ' ' + url.replace(/[?#].*/, '').replace(/\/$/, '');
};

const add = (method, url, handler) => {
	const endpoint = getEndpoint(method, url);
	endpointMap[endpoint] = handler;
};

const get = (url, handler) => add('get', url, handler);
const post = (url, handler) => add('post', url, handler);

const middleware = async (req, res, next) => {
	res.json = function (data) {
		const json = JSON.stringify(data);
		const body = Buffer.from(json, 'utf8');
		this.send({
			status: 200,
			headers: {
				'content-type': 'application/json; charset=utf-8',
				'content-length': body.length,
			},
			body
		});
	};
	parseQuery(req);
	await parseBody(req);
	let url = req.url;
	const endpoint = getEndpoint(req.method, url);
	const handler = endpointMap[endpoint];
	if (handler) {
		handler(req, res);
	} else {
		next();
	}
};

module.exports = { get, post, middleware };
