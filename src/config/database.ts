import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

// Função para abrir a conexão
export const getDatabaseConnection = async (): Promise<Database> => {
	return open({
		filename: "./db/database.db",
		driver: sqlite3.Database,
	});
};

// Função para iniciar as tabelas
export const initializeDatabase = async () => {
	const db = await getDatabaseConnection();

	console.log("🏗️  Verificando estrutura do banco de dados...");

	// 1. Tabela PRODUTOS_MENU 
	await db.exec(`
        CREATE TABLE IF NOT EXISTS produtos_menu (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            preco REAL NOT NULL,
            imagem TEXT, -- Nova coluna para URL da foto
            disponivel BOOLEAN DEFAULT 1
        )
    `);

	// 2. Tabela INGREDIENTES
	await db.exec(`
        CREATE TABLE IF NOT EXISTS ingredientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            unidade_medida TEXT NOT NULL,
            quantidade REAL DEFAULT 0
        )
    `);

	// 3. Tabela de Relacionamento PRODUTO - INGREDIENTE (N:N)
	await db.exec(`
        CREATE TABLE IF NOT EXISTS produto_ingredientes (
            produto_id INTEGER,
            ingrediente_id INTEGER,
            FOREIGN KEY(produto_id) REFERENCES produtos_menu(id),
            FOREIGN KEY(ingrediente_id) REFERENCES ingredientes(id),
            PRIMARY KEY (produto_id, ingrediente_id)
        )
    `);

	// 4. Tabela PEDIDOS
	await db.exec(`
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            numero_mesa INTEGER NOT NULL,
            status TEXT NOT NULL, -- 'Recebido', 'Em Preparo', 'Pronto', 'Entregue'
            observacao TEXT,
            data_hora_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
            data_hora_finalizacao DATETIME
        )
    `);

	// 5. Tabela ITENS_PEDIDO (O que tem no pedido)
	await db.exec(`
        CREATE TABLE IF NOT EXISTS itens_pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            preco_unitario_registro REAL, -- Preço na hora da compra (para histórico)
            FOREIGN KEY(pedido_id) REFERENCES pedidos(id),
            FOREIGN KEY(produto_id) REFERENCES produtos_menu(id)
        )
    `);

	// 6. Tabela USUARIOS
	await db.exec(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senha TEXT NOT NULL,
            cargo TEXT DEFAULT 'cozinheiro' -- 'admin' ou 'cozinheiro'
        )
    `);

	console.log("✅ Banco de dados pronto!");
};
