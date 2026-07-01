# Autenticação JWT - Platzi Fake Store

Sistema Angular para gestão dos dados da Platzi Fake Store API, com autenticação JWT, rotas protegidas, interceptor HTTP e telas de prototipagem para operações de produtos e categorias.

## Sobre o projeto

O objetivo deste projeto é simular um painel administrativo para a Platzi Fake Store API. Depois do login, o usuário acessa listagens protegidas de produtos e categorias, pode pesquisar registros e navegar por telas de inclusão, edição e exclusão simuladas.

As operações de cadastro, edição e exclusão são apenas protótipos visuais. Nenhum dado é alterado permanentemente na API.

## Funcionalidades

- Login com JWT usando a Platzi Fake Store API.
- Proteção de rotas internas com `authGuard`.
- Envio automático do token nas requisições com `authInterceptor`.
- Listagem de produtos com filtros por nome, categoria e preço máximo.
- Listagem de categorias com filtros por nome/slug e vínculo com produtos.
- Tela de inclusão simulada de produtos.
- Tela de edição simulada de produtos.
- Tela de exclusão simulada de produtos.
- Tela de inclusão simulada de categorias.
- Tela de edição simulada de categorias.
- Tela de exclusão simulada de categorias.
- `canDeactivate` nos formulários para avisar sobre alterações não salvas.
- Layout responsivo feito com CSS customizado.

## API utilizada

Platzi Fake Store API:

```text
https://fakeapi.platzi.com
```

Base URL usada no projeto:

```text
https://api.escuelajs.co/api/v1
```

Endpoints principais:

```text
POST /auth/login
GET  /auth/profile
GET  /products
GET  /products/:id
GET  /categories
GET  /categories/:id
```

## Credencial de teste

```text
Email: john@mail.com
Senha: changeme
```

## Tecnologias

- Angular
- TypeScript
- RxJS
- Angular Router
- Reactive Forms
- CSS

## Como executar

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

Acesse no navegador:

```text
http://localhost:4200
```

## Build

Para gerar a versão de produção:

```bash
npm run build
```

Os arquivos serão gerados em:

```text
dist/autenticacao-jwt
```

## Estrutura principal

```text
src/app
  auth
    auth.guard.ts
    auth.interceptor.ts
    unsaved-changes.guard.ts

  pages
    login.page.ts
    product-list.page.ts
    product-form.page.ts
    category-list.page.ts
    category-form.page.ts
    delete.page.ts

  services
    auth.service.ts
    platzi-api.service.ts
```

## Rotas

```text
/login
/produtos
/produtos/novo
/produtos/:id/editar
/produtos/:id/excluir
/categorias
/categorias/novo
/categorias/:id/editar
/categorias/:id/excluir
```

## Observações

- É necessário estar autenticado para acessar produtos e categorias.
- O token JWT é armazenado no `localStorage`.
- O interceptor adiciona o token somente nas requisições para a API da Platzi.
- Os formulários avisam antes de sair quando existem alterações não salvas.
