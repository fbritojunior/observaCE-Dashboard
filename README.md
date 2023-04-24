# Script para execução
Clone o repositório: 

``
git clone https://github.com/fbritojunior/observaCE-Dashboard
``

Acesse a pasta raiz do projeto
``
cd observaCE-Dashboard
``


## Para execução em modo produção utilizando Docker
Na pasta raiz do projeto, execute o build da imagem com o nome `docker-react-app`
``
docker build . -t docker-react-app
``

E execute a imagem na porta 3000
``
docker run -p 3000:3000 -d docker-react-app
``

Abra o navegador e acesse a URL [http://localhost:3000](http://localhost:3000).


## Para execução em modo desenvolvimento
Na pasta raiz do projeto, instale as dependências do projeto
``
npm install
``

Execute o app
``
npm start
``
