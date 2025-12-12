/**
 * ============================================================================
 * NOME DO ARQUIVO: database.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Configuração e inicialização do banco de dados SQLite.
 *            Contém funções para abrir conexão e criar as tabelas necessárias
 *            para o funcionamento do sistema (produtos, ingredientes, pedidos, usuários).
 * ============================================================================
 */

import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";

/**
 * Abre uma conexão com o banco de dados SQLite.
 * Utiliza o driver 'sqlite3' e o arquivo localizado em './db/database.db'.
 * 
 * @returns {Promise<Database>} Uma promessa que resolve com a instância do banco de dados.
 */
export const getDatabaseConnection = async (): Promise<Database> => {
	return open({
		filename: "./db/database.db",
		driver: sqlite3.Database,
	});
};

/**
 * Inicializa a estrutura do banco de dados.
 * Cria as tabelas necessárias se elas não existirem:
 * - produtos_menu: Itens do cardápio.
 * - ingredientes: Estoque de ingredientes.
 * - produto_ingredientes: Relacionamento N:N entre produtos e ingredientes.
 * - pedidos: Registro de pedidos realizados.
 * - itens_pedido: Itens contidos em cada pedido.
 * - usuarios: Usuários do sistema (admin, cozinha, etc).
 */
export const initializeDatabase = async () => {
	const db = await getDatabaseConnection();

	console.log("🏗️  Verificando estrutura do banco de dados...");

	/**
     * ============================================================================
     * 1. TABELA PRODUTOS_MENU
     * ============================================================================
     * Tabela que armazena os produtos disponíveis no cardápio.
     */
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

	/**
     * ============================================================================
     * 2. TABELA INGREDIENTES
     * ============================================================================
     * Tabela para controle de estoque dos ingredientes.
     */
	await db.exec(`
        CREATE TABLE IF NOT EXISTS ingredientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            unidade_medida TEXT NOT NULL,
            quantidade REAL DEFAULT 0
        )
    `);

	/**
     * ============================================================================
     * 3. TABELA DE RELACIONAMENTO PRODUTO - INGREDIENTE (N:N)
     * ============================================================================
     * Tabela associativa que define quais ingredientes compõem um produto.
     */
	await db.exec(`
        CREATE TABLE IF NOT EXISTS produto_ingredientes (
            produto_id INTEGER,
            ingrediente_id INTEGER,
            FOREIGN KEY(produto_id) REFERENCES produtos_menu(id),
            FOREIGN KEY(ingrediente_id) REFERENCES ingredientes(id),
            PRIMARY KEY (produto_id, ingrediente_id)
        )
    `);

	/**
     * ============================================================================
     * 4. TABELA PEDIDOS
     * ============================================================================
     * Tabela que registra os pedidos feitos pelos clientes.
     */
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

	/**
     * ============================================================================
     * 5. TABELA ITENS_PEDIDO
     * ============================================================================
     * Tabela que detalha os produtos contidos em cada pedido.
     */
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

	/**
     * ============================================================================
     * 6. TABELA USUARIOS
     * ============================================================================
     * Tabela de usuários do sistema (administradores, cozinheiros, etc.).
     */
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
