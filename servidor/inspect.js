const parseBody = require('./parse-body');
const getCharset = require('./get-charset');
const messages = [];
// const pageSize = 15;

function inspect(req, res) {
	const time = Date.now();
	const msg = { time, req, res };
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

function parseMessage({ time, req, res }) {
	return {
		time,
		endpoint: req.method + ' ' + req.url,
		req: parseReq(req),
		res: parseRes(res),
	};
}

module.exports = inspect;

module.exports.get = async ({ time }) => {
	// const nPages = Math.ceil(messages.length/pageSize);
	// const last = nPages - 1;
	// const pageIndex = Math.min(last, Math.max(0, page));
	// const a = page*pageSize;
	// const b = a + pageSize - 1;
	// return {
	// 	nPages,
	// 	pageIndex: page,
	// 	messages: messages.slice(a, b).map(parseMessage),
	// };
	return messages.filter((msg) => msg.time > time).map(parseMessage);
};

module.exports.clear = () => {
	messages.length = 0;
};
