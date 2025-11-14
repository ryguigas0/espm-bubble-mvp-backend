# Bubble - Backend MVP

Backend para o projeto Bubble, desenvolvido como parte do MVP para a ESPM. Construído com NestJS, TypeScript e MongoDB.

## ✨ Features

- **Framework Moderno**: Construído sobre o [NestJS](https://nestjs.com/), um framework Node.js progressivo para a construção de aplicações eficientes e escaláveis.
- **Autenticação e Autorização**: Sistema de login seguro utilizando JSON Web Tokens (JWT).
- **Banco de Dados NoSQL**: Integração com MongoDB através do Mongoose para uma modelagem de dados flexível.
- **Ambiente Containerizado**: Configuração pronta para uso com Docker e Docker Compose.
- **Qualidade de Código**: Padronização de código garantida com ESLint e Prettier.
- **Configuração Centralizada**: Gerenciamento de variáveis de ambiente com o módulo `@nestjs/config`.

## 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

- [Node.js](https://nodejs.org/) (versão `24.5.0` ou superior)
- [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)
- [NPM](https://www.npmjs.com/get-npm) ou um gerenciador de pacotes compatível

## 🚀 Começando (Ambiente de Desenvolvimento)

Siga os passos abaixo para configurar e executar o projeto localmente para desenvolvimento.

### 1. Clone o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd espm-bubble-mvp-backend
````

### 2\. Instale as Dependências

Este comando irá instalar todas as dependências listadas no arquivo `package.json`.

```bash
npm install
```

### 3\. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.

```bash
cp .env.example .env
```

Abra o arquivo `.env` e ajuste as variáveis conforme necessário.

> **Nota:** A variável `MONGO_URI` padrão (`mongodb://root:root@localhost:27017/bubble`) já está configurada para funcionar com o Docker Compose de desenvolvimento descrito abaixo.

### 4\. Inicie o Banco de Dados

Para desenvolvimento local, utilizaremos o arquivo `dev-compose.yaml`, que sobe apenas o MongoDB e o Mongo Express, permitindo que você rode a aplicação Node.js localmente na sua máquina.

```bash
docker-compose -f dev-compose.yaml up -d
```

  - O MongoDB estará acessível em `localhost:27017`.
  - O Mongo Express (interface de administração) estará acessível em `http://localhost:8081`.

### 5\. Executando a Aplicação

Com o banco de dados rodando, inicie a aplicação em modo de desenvolvimento (com *hot-reload*):

```bash
npm run start:dev
```

A aplicação estará rodando em `http://localhost:3000` (ou na porta definida no seu `.env`).

## 🐳 Executando via Docker (Stack Completa)

Se você deseja rodar a aplicação inteira (Backend + Banco de Dados) dentro de containers (simulando produção), utilize o comando padrão do docker-compose:

```bash
docker-compose up --build -d
```

Neste modo, o backend é construído a partir do `Dockerfile` e executado na porta definida.

## 🧪 Testando a API (Insomnia)

Este repositório inclui um arquivo de exportação do **Insomnia** para facilitar os testes das rotas.

1.  Abra o [Insomnia](https://insomnia.rest/).
2.  Vá em `Application` -\> `Preferences` -\> `Data` -\> `Import Data` -\> `From File`.
3.  Selecione o arquivo `Bubble_Insomnia.yaml` localizado na raiz deste projeto.

## ⚙️ Variáveis de Ambiente

As seguintes variáveis de ambiente são utilizadas pela aplicação e devem ser definidas no arquivo `.env`.

| Variável | Descrição | Exemplo |
| --- | --- | --- |
| `PORT` | A porta em que a aplicação NestJS irá rodar. | `3000` |
| `VERSION` | Versão da aplicação retornada pela rota raiz. | `0.1` |
| `JWT_SECRET` | Chave secreta para assinar os tokens JWT. | `sua_chave_secreta_aqui` |
| `JWT_EXPIRES` | Tempo de expiração para os tokens JWT. | `60s` |
| `MONGO_URI` | String de conexão completa com o MongoDB. | `mongodb://root:root@localhost:27017/bubble` |
| `MONGO_AUTH_SOURCE` | O banco de dados de autenticação do MongoDB. | `admin` |

## 📜 Licença

Este projeto não possui uma licença definida.
