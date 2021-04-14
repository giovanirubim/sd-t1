const { get, post, middleware } = require('./api-router');
const inspect = require('./inspect');

const messages = [];

post('/api/messages', async (req, res) => {
	const { body } = req;
	messages.push(body);
	res.send({ status: 200 });
});

get('/api/messages', (req, res) => {
	const { query } = req;
	const skip = query.skip || 0;
	res.json(messages.slice(skip));
});

get('/api/http-messages', async (req, res) => {
	req.ignore_request = true;
	const { query } = req;
	res.json(await inspect.get(query));
});

post('/api/clear', (req, res) => {
	inspect.clear();
	messages.length = [];
	res.send({ status: 200 });
});

module.exports = middleware;
