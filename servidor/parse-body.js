const URL = require('url');
const getCharset = require('./get-charset');
const DEFAULT_CHARSET = 'utf8';

const loadRawBody = (req) => new Promise((done, fail) => {
	const chunks = [];
	if (req.raw_body !== undefined) {
		done(req.raw_body);
		return;
	}
	req.on('data', (chunk) => chunks.push(chunk));
	req.on('end', () => {
		const raw_body = Buffer.concat(chunks);
		req.raw_body = raw_body;
		done(raw_body);
	});
	req.on('error', fail);
});

module.exports = async (req) => {

	const buffer = await loadRawBody(req);
	const contentType = req.headers['content-type'] || '';
	const [mime] = contentType.split(',')[0].split(';');
	const charset = getCharset(contentType) || DEFAULT_CHARSET;
	const stringBody = buffer.toString(charset);
	
	let body = null;
	if (mime.startsWith('text/')) {
		body = stringBody;
	} else if (mime === 'application/json') {
		body = JSON.parse(stringBody);
	} else if (mime === 'application/x-www-form-urlencoded') {
		body = URL.parse('/?' + stringBody, true).query;
	}

	req.body = body;
	return body;
};
