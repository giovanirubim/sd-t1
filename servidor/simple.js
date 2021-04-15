const http = require('http');
const host = '0.0.0.0';
const port = 8090;

function messageHandler(request, response) {

	var method = request.method;
	var url = request.url;
	console.log(method + ' ' + url);

	var message = 'Ola mundo';
	response.writeHead(200, {
		'content-type': 'text/plain',
		'content-length': message.length
	});
	response.write(message);
	response.end();
}

const server = http.createServer(messageHandler);

server.listen(port, host, function(){
	console.log('Servidor iniciado');
});
