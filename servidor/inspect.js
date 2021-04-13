const parseBody = require('./parse-body');
const getCharset = require('./get-charset');
const messages = [];

function inspect(req, res) {
	const msg = { req, res };
	res.send = function ({ status, headers, body }) {
		msg.res.data = { status, headers, body };
		this.writeHead(status, headers);
		if (body) {
			this.write(body);
		}
		this.end();
		if (!req.ignore_request) {
			messages.push(msg)
		}
	};
}

function parseReq(req) {
	const lines = [
		`${req.method} ${req.url} HTTP/${req.httpVersion}`,
	];
	const { headers } = req;
	for (let name in headers) {
		const content = headers[name];
		lines.push(`${name}: ${content}`);
	}
	const header = lines.join('\n');
	let body = null;
	if (req.raw_body) {
		const charset = getCharset(req.headers['content-type']) ?? 'latin1';
		body = req.raw_body.toString(charset);
	}
	return { header, body };
}

const parseHeaders = (string) => {
	const headers = {};
	string.trim().split(/\s*\n\s*/).forEach(pair => {
		let [name, content] = pair.split(/\s*:\s*/);
		if (name) {
			headers[name.toLowerCase()] = content;
		}
	});
	return headers;
};

function parseRes(res) {
	const header = res._header.trim().replace(/\s*\n\s*/g, '\n');
	let body = null;
	if (res.data.body) {
		const charset = getCharset(res.data.headers['content-type']) ?? 'latin1';
		body = res.data.body.toString(charset);
	}
	return { header, body };
}

function parseMessage({ req, res }) {
	return {
		endpoint: req.method + ' ' + req.url,
		req: parseReq(req),
		res: parseRes(res),
	};
}

module.exports = inspect;

module.exports.get = async (skip = 0) => {
	const array = [];
	const src = messages.slice(skip);
	for (let msg of src) {
		array.push(parseMessage(msg));
	}
	return array;
};
