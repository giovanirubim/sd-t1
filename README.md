# Servidor Web

Um servidor web (ou *web server*) é um servidor que faz uso do protocolo **HTTP** ou **HTTPS**.

## Protocolo HTTP/HTTPS

HTTP é um protocolo da camada de aplicação que utiliza na camada de transporte o protocolo TCP ou UDP, dependendo da versão.
Numa conexão HTTP o fluxo de informação se dá através da troca de **mensagens HTTP**.
As mensagens HTTP possuem uma sintaxe textual e são utilizadas em pares de **mensagem de requisição** e **mensagem de resposta**.
Mensagens de requisição podem ser utilizadas para consultar um recurso ou iniciar alguma ação na outra ponta da conexão.
Mensagens de resposta podem trazer um recurso consultado ou um estado relativo à requisição como um estado de sucesso ou um estado de erro.
A sintaxe de uma mensagem HTTP segue o seguinte formato:

- Linha de requisição/Linha de estado;
- Cabeçalhos;
- Linha em branco;
- Corpo da mensagem.

Um dos componentes obrigatórios de uma mensagem de requisição é a especificação do **método** ou verbo.
A ideia geral de um método é especificar o tipo de comportamento e resposta que se espera da outra ponta da conexão.
Por exemplo, entende-se requisições que utilizam o método **GET** estarão consultando algum recurso do servidor de forma que a requisição não irá provocar alguma mudança de estado no servidor. Geralmente requisições GET não possuem corpo.
Levando em consideração o significado do método GET, browsers podem, por exemplo, realizar a requisição para consultar um recurso e mantê-lo no cache antes que o usuário faça alguma ação que necessite daquele recurso, assim diminuindo o tempo de resposta da interação do usuário com o sistema.
Um outro exemplo de método comum é o método **POST** onde entende-se que as requisições que utilizam este método enviam dados ao servidor que devem ser processados (geralmente armazenados) alterando o estado do servidor.

## Websites

Servidores web são geralmente utilizados para disponibilizar de forma on-line um conjunto de páginas web que formam um website.
Páginas web são comumente construídas utilizando arquivos do tipo **HTML** que utiliza uma sintaxe similar à XML para descrever elementos HTML (ou DOM Elements).
A renderização da interface a partir de um arquivo HTML acontece no lado cliente e é realizada por **browsers** como Google Chrome, Mozilla Firefox, Opera entre outros.
É também comum a presença de arquivos do tipo **CSS** e **JavaScript**.
Arquivos CSS especificam regras de apresentação que serão aplicadas aos elementos HTML.
Arquivos JavaScript são códigos fontes que interagem com os elementos HTML, com o browser e até mesmo com o servidor web ou outros servidores.
Websites que contam apenas com estes tipos de arquivos não recebem informações dos usuários e toda mudança de estado no website deve ser feita por meios manuais no servidor.
Para permitir que o website seja também um sistema dinâmico muitos servidores permitem a integração do conteúdo HTML com alguma linguagem de programação como Java ou PHP onde os arquivos fonte não são visíveis ao cliente mas sua execução, provocada por requisições, constroem arquivos com um conteúdo HTML que são enviados como resposta.

## APIs Web

Outra utilização comum para servidores web são as APIs web que implementam uma interface mais simples geralmente desprovida de recursos gráficos, pois a ideia de uma API web é possibilitar que softwares possam ter uma fácil interação com o sistema.
Exemplos de protocolos comuns de APIs web são os protocolos **SOAP** e **REST** que utilizam as linguagens de notação XML e JSON, respectivamente.
