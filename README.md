# GastroFlow 👨‍🍳🍲

> Sistema de Gestão de Pedidos para Cozinha de Restaurante.

O **GastroFlow** é uma aplicação web desenvolvida como projeto final para a disciplina de Desenvolvimento Web. O objetivo é otimizar o fluxo de trabalho em cozinhas profissionais através de um sistema digital de controle de pedidos e estoque.

## 📋 Sobre o Projeto

A aplicação substitui as comandas de papel por um **Kanban digital**, permitindo que a equipe da cozinha visualize e atualize o status dos pedidos em tempo real (Recebido, Em Preparo, Pronto). Além disso, oferece um módulo administrativo para gestão de cardápio e controle simplificado de ingredientes.

## 🚀 Funcionalidades

### 🖥️ Cozinha (Operacional)
- **Kanban de Pedidos:** Visualização clara dos pedidos divididos por status.
- **Atualização de Status:** Movimentação dinâmica dos pedidos (ex: iniciar preparo, marcar como pronto).
- **Fila de Pedidos:** Visualização detalhada dos itens de cada pedido e número da mesa.

### 🛠️ Administração (Gerencial)
- **Gestão de Cardápio:** Cadastro, edição e remoção de pratos e bebidas com fotos e preços.
- **Controle de Ingredientes:** Gestão de estoque de insumos e vinculação de ingredientes aos pratos.
- **Histórico:** Visualização de pedidos finalizados.

## 💻 Tecnologias Utilizadas

O projeto foi desenvolvido seguindo a arquitetura **MVC (Model-View-Controller)** com o padrão **Repository** para persistência de dados.

### Backend
- **Node.js** & **Express**: Servidor web e API REST.
- **TypeScript**: Para tipagem estática e segurança no código.
- **SQLite 3**: Banco de dados relacional (SQL).
- **Repository Pattern**: Camada dedicada para isolar as queries SQL da regra de negócio.

### Frontend
- **HTML5 & CSS3**: Estrutura e estilização das páginas.
- **Bootstrap 5**: Framework para layout responsivo e componentes visuais.
- **JavaScript (Vanilla)**: Manipulação do DOM e consumo da API (Fetch API).

## 📂 Estrutura de Pastas

A organização do projeto separa claramente os arquivos públicos (Frontend) do código fonte do servidor (Backend).

```text
/
├── public/                 # Arquivos estáticos servidos pelo Express (Frontend)
│   ├── css/                # Estilos globais e Bootstrap local
│   ├── js/                 # Scripts do client-side (Lógica das telas)
│   ├── img/                # Imagens dos pratos e assets
│   └── *.html              # Páginas da aplicação (Login, Cozinha, Admin)
├── src/                    # Código fonte do Backend
│   ├── config/             # Configuração de conexão com o Banco de Dados
│   ├── controllers/        # Controladores (Regras de negócio e resposta HTTP)
│   ├── models/             # Interfaces e Tipos (TypeScript Interfaces)
│   ├── repositories/       # Camada de Acesso a Dados (Queries SQL)
│   ├── routes/             # Definição das rotas da API
│   ├── app.ts              # Configuração do App Express (Middlewares)
│   └── server.ts           # Inicialização do servidor
├── db/                     # Arquivos do SQLite e scripts de migração
├── package.json            # Dependências do projeto
└── tsconfig.json           # Configurações do TypeScript