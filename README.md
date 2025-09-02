# Bubble - Backend MVP

Backend para o projeto Bubble, desenvolvido como parte do MVP para a ESPM. Construído com NestJS, TypeScript e MongoDB.

## ✨ Features

  - **Framework Moderno**: Construído sobre o [NestJS](https://nestjs.com/), um framework Node.js progressivo para a construção de aplicações eficientes e escaláveis.
  - **Autenticação e Autorização**: Sistema de login seguro utilizando JSON Web Tokens (JWT).
  - **Banco de Dados NoSQL**: Integração com MongoDB através do Mongoose para uma modelagem de dados flexível.
  - **Ambiente Containerizado**: Configuração pronta para uso com Docker e Docker Compose, facilitando o setup do ambiente de desenvolvimento.
  - **Qualidade de Código**: Padronização de código garantida com ESLint e Prettier.
  - **Configuração Centralizada**: Gerenciamento de variáveis de ambiente com o módulo `@nestjs/config`.

## 📋 Pré-requisitos

Antes de começar, certifique-se de que você tem as seguintes ferramentas instaladas em sua máquina:

  - [Node.js](https://nodejs.org/) (versão `24.5.0` ou superior)
  - [Docker](https://www.docker.com/get-started) e [Docker Compose](https://docs.docker.com/compose/install/)
  - [NPM](https://www.npmjs.com/get-npm) ou um gerenciador de pacotes compatível

## 🚀 Começando

Siga os passos abaixo para configurar e executar o projeto localmente.

### 1. Clone o Repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd espm-bubble-mvp-backend
```

### 2. Instale as Dependências

Este comando irá instalar todas as dependências listadas no arquivo `package.json`.

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo de exemplo `.env.example` para um novo arquivo chamado `.env`.

```bash
cp .env.example .env
```

Abra o arquivo `.env` e ajuste as variáveis conforme necessário. Os valores padrão são geralmente suficientes para o ambiente de desenvolvimento local.

### 4. Inicie o Banco de Dados

Para iniciar o container do MongoDB e do Mongo Express, execute o comando abaixo. O `-d` garante que os containers rodem em background.

```bash
docker-compose up -d
```

  - O MongoDB estará acessível em `localhost:27017` (ou a porta que você definiu no `.env`).
  - O Mongo Express (interface de administração) estará acessível em `http://localhost:8081`.

## Executando a Aplicação

Os scripts para executar a aplicação estão definidos no `package.json`.

```bash
# Modo de desenvolvimento com watch mode
npm run start:dev

# Modo de produção (requer build prévio)
npm run build
npm run start:prod

# Modo de debug com watch mode
npm run start:debug
```

## ⚙️ Variáveis de Ambiente

As seguintes variáveis de ambiente são utilizadas pela aplicação e devem ser definidas no arquivo `.env`.

| Variável            | Descrição                                                 | Exemplo                                 |
| ------------------- | --------------------------------------------------------- | --------------------------------------- |
| `PORT`              | A porta em que a aplicação NestJS irá rodar.                | `3000`                                  |
| `VERSION`           | Versão da aplicação retornada pela rota raiz.             | `0.1`                                   |
| `JWT_SECRET`        | Chave secreta para assinar os tokens JWT.                 | `07a1158f54ed81ea46de0ba2f6be5658`      |
| `JWT_EXPIRES`       | Tempo de expiração para os tokens JWT (ex: `60s`, `1h`).    | `60s`                                   |
| `MONGO_USER`        | Usuário root para o banco de dados MongoDB.               | `root`                                  |
| `MONGO_PASS`        | Senha do usuário root do MongoDB.                         | `root`                                  |
| `MONGO_HOST`        | Host do serviço do MongoDB (geralmente o nome do serviço no Docker). | `localhost`                             |
| `MONGO_PORT`        | Porta em que o MongoDB está exposto.                        | `27017`                                 |
| `MONGO_DB`          | Nome do banco de dados a ser utilizado pela aplicação.      | `bubble`                                |
| `MONGO_AUTH_SOURCE` | O banco de dados de autenticação do MongoDB.              | `admin`                                 |


## 📜 Licença

Este projeto não possui uma licença definida.
