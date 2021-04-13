const parseBody = require('./parse-body');
const parseQuery = require('./parse-query');
const inspect = require('./inspect');

const endpointMap = {};
const getEndpoint = (method, url) => {
	return method.toUpperCase() + ' ' + url.replace(/[?#].*/, '');
};

const messages = [];

const add = (method, url, handler) => {
	const endpoint = getEndpoint(method, url);
	endpointMap[endpoint] = handler;
};

const get = (url, handler) => add('get', url, handler);
const post = (url, handler) => add('post', url, handler);

post('/api/messages', async (req, res) => {
	const body = await parseBody(req);
	messages.push(body);
	res.send({ status: 200 });
});

get('/api/messages', (req, res) => {
	const skip = parseQuery(req).skip || 0;
	res.json(messages.slice(skip));
});

get('/api/http-messages', async (req, res) => {
	req.ignore_request = true;
	res.json(await inspect.get());
});

module.exports = (req, res, next) => {
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
	let url = req.url;
	const endpoint = getEndpoint(req.method, url);
	const handler = endpointMap[endpoint];
	if (handler) {
		handler(req, res);
	} else {
		next();
	}
};
