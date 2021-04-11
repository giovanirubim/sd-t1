// Módulo que implementa o protocolo HTTP
const http = require('http');

// FS = File System (módulo de acesso ao sistema de arquivos)
const fs = require('fs');

// Módulo para lidar com caminhos de arquivos
const path = require('path');

// Diretório raiz do projeto
const currentDir = __dirname;

// Diretório contendo o conteúdo WEB do servidor
const webDir = path.join(currentDir, 'web-dir');

// Porta do servidor
const port = 80;

// Função que lida com cada nova requisição
function httpMessageHandler(request, response) {

	// URL da requisição
	let url = request.url;

	// Remove query e hash
	let filePath = url.replace(/[?#].*/, '');

	// Caminho completo do arquivo
	let pathName = path.join(webDir, filePath);

	try {

		// Se o arquivo não existe ou é um diretório responde com o código de status 404 (Not found)
		if (!fs.existsSync(pathName) || fs.lstatSync(pathName).isDirectory()) {
			response.writeHead(404);
			response.end();
			return;
		}

		// Lê o arquivo todo para um buffer (array de bytes)
		const buffer = fs.readFileSync(pathName);

		// Busca o content-type
		const type = getMime(pathName);

		// Responde com código de status 200
		response.writeHead(200, {
			'content-type': type,
			'content-length': buffer.length
		});
		
		// Envia o conteúdo do arquivo no body
		response.write(buffer);
		response.end();

	} catch(error) {

		// Responde com código 500 (Erro interno do servidor)
		response.writeHead(500);
		response.end();

		console.error(error);
	}
}

// Cria servidor
const server = http.createServer(httpMessageHandler);

// Inicia servidor na porta especificada
console.log('Port: ' + port);
server.listen(port, function() {
	// Servidor iniciado
	console.log('Server started');
});

// Recebe um caminho de arquivo e retorna o content-type correspondente
function getMime(filePath) {
	const extension = filePath
		.replace(/^.*\//, '')
		.replace(/^.*\./, '')
		.toLowerCase();
	switch (extension) {
		case 'html': return 'text/html';
		case 'js': return 'application/javascript';
	}
	return 'application/octet-stream';
}
