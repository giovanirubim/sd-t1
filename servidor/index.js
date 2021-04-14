// Módulo que implementa o protocolo HTTP
const http = require('http');

// FS = File System (módulo de acesso ao sistema de arquivos)
const fs = require('fs');

// Módulo para lidar com caminhos de arquivos
const path = require('path');

// Módulo para inspecionar as mensagens http
const inspect = require('./inspect');

// Diretório raiz do projeto
const currentDir = __dirname;

// Diretório contendo o conteúdo WEB do servidor
const webDir = path.join(currentDir, 'web-dir');

// Porta do servidor
const port = process.env.PORT || 80;

// Host do servidor
const host = process.env.HOST || '0.0.0.0';

// Função para o envio de resposta
function send({ status, headers, body }) {
	console.log('teste')
	this.writeHead(status, headers);
	if (body) {
		this.write(body);
	}
	this.end();
};

// Função que lida com cada nova requisição
function handleFileRequest(request, response) {

	// URL da requisição
	let url = request.url;

	// Remove query e hash
	let filePath = url.replace(/[?#].*/, '');

	// Caminho completo do arquivo
	let pathName = path.join(webDir, filePath);

	// Caso seja um caminho de diretório direciona o acesso ao arquivo padrão
	if (/[\\\/]$/.test(pathName)) {
		pathName += 'index.html';
	}

	try {

		// Se o arquivo não existe ou é um diretório responde com o código de status 404 (Not found)
		if (!fs.existsSync(pathName) || fs.lstatSync(pathName).isDirectory()) {
			response.send({ status: 404 });
			return;
		}

		// Lê o arquivo todo para um buffer (array de bytes)
		const buffer = fs.readFileSync(pathName);

		// Busca o content-type
		const type = getMime(pathName);

		// Responde com código de status 200
		response.send({
			status: 200,
			headers: {
				'content-type': type,
				'content-length': buffer.length
			},
			body: buffer
		});
		
	} catch(error) {

		// Responde com código 500 (Erro interno do servidor)
		response.send({ status: 500 });
		console.error(error);
	}
}

// Middleware web-api
const api = require('./api');

// Cria servidor
const server = http.createServer(function(request, response) {

	// Adiciona o método send no objeto de response
	response.send = send;

	// Monitora as mensagens HTTP
	inspect(request, response);

	// Verifica se a requisição é para uma chamada da API
	api(request, response, () => {

		// Se a requisição não for tratada pelas chamadas de API considera uma requisição de arquivo
		handleFileRequest(request, response);

	});
});

// Inicia servidor na porta especificada
console.log('Port: ' + port);
server.listen(port, host, function() {
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
		case 'html': return 'text/html; charset=utf-8';
		case 'js': return 'application/javascript; charset=utf-8';
		case 'css': return 'text/css; charset=utf-8';
	}

	return 'application/octet-stream';
}
