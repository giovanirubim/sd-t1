module.exports = (type) => {
	
	if (!type) {
		return null;
	}
	
	let encoding = type
		.replace(/\s/g, '')
		.toLowerCase()
		.split(',')[0]
		.split(';')[1];

	if (encoding && encoding.startsWith('charset=')) {
		encoding = encoding.split('=')[1];
		if (/iso-8859|1252|latin1/.test(encoding)) {
			return 'latin1';
		} else if (/utf-?8/.test(encoding)) {
			return 'utf8';
		}
	}

	return null;
};
