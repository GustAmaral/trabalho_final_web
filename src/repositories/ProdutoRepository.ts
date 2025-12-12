/**
 * ============================================================================
 * NOME DO ARQUIVO: ProdutoRepository.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Repositório responsável pelo acesso a dados da tabela 'produtos_menu'.
 *            Gerencia produtos e seus relacionamentos com ingredientes.
 * ============================================================================
 */

import { getDatabaseConnection } from "../config/database";
import { Produto } from "../models/Produto";

export class ProdutoRepository {
	/**
	 * Lista todos os produtos do cardápio, incluindo seus ingredientes.
	 * 
	 * @returns {Promise<Produto[]>} Lista de produtos com ingredientes populados.
	 */
	async findAll(): Promise<Produto[]> {
		const db = await getDatabaseConnection();

		// 1. Busca os produtos
		const produtos = await db.all<Produto[]>("SELECT * FROM produtos_menu");

		// 2. Busca os ingredientes de cada produto
		for (const produto of produtos) {
			const ingredientes = await db.all(
				`
                SELECT i.* FROM ingredientes i
                JOIN produto_ingredientes pi ON pi.ingrediente_id = i.id
                WHERE pi.produto_id = ?
            `,
				[produto.id]
			);

			produto.ingredientes = ingredientes;
		}

		return produtos;
	}

	/**
	 * Cria um novo produto e associa seus ingredientes.
	 * Utiliza transação para garantir a consistência dos dados.
	 * 
	 * @param {Produto} produto - Objeto contendo dados do produto e IDs dos ingredientes.
	 * @returns {Promise<void>}
	 */
	async create(produto: Produto): Promise<void> {
		const db = await getDatabaseConnection();
		try {
			await db.run("BEGIN TRANSACTION");

			// Insere Produto com Imagem
			const result = await db.run(
				"INSERT INTO produtos_menu (nome, descricao, preco, imagem, disponivel) VALUES (?, ?, ?, ?, ?)",
				[
					produto.nome,
					produto.descricao,
					produto.preco,
					produto.imagem || "",
					produto.disponivel ? 1 : 0,
				]
			);

			const produtoId = result.lastID;

			// Insere Vínculos
			if (produto.ingredientesIds?.length) {
				for (const ingId of produto.ingredientesIds) {
					await db.run(
						"INSERT INTO produto_ingredientes (produto_id, ingrediente_id) VALUES (?, ?)",
						[produtoId, ingId]
					);
				}
			}

			await db.run("COMMIT");
		} catch (error) {
			await db.run("ROLLBACK");
			throw error;
		}
	}

	/**
	 * Atualiza um produto existente e seus relacionamentos com ingredientes.
	 * Remove os vínculos antigos de ingredientes e cria novos.
	 * 
	 * @param {number} id - ID do produto.
	 * @param {Produto} produto - Novos dados do produto.
	 * @returns {Promise<void>}
	 */
	async update(id: number, produto: Produto): Promise<void> {
		const db = await getDatabaseConnection();
		try {
			await db.run("BEGIN TRANSACTION");

			// 1. Atualiza dados básicos
			await db.run(
				"UPDATE produtos_menu SET nome=?, descricao=?, preco=?, imagem=? WHERE id=?",
				[produto.nome, produto.descricao, produto.preco, produto.imagem, id]
			);

			// 2. Atualiza ingredientes (Apaga tudo e recria - estratégia mais simples)
			await db.run("DELETE FROM produto_ingredientes WHERE produto_id = ?", [
				id,
			]);

			if (produto.ingredientesIds?.length) {
				for (const ingId of produto.ingredientesIds) {
					await db.run(
						"INSERT INTO produto_ingredientes (produto_id, ingrediente_id) VALUES (?, ?)",
						[id, ingId] 
					);
				}
			}

			await db.run("COMMIT");
		} catch (error) {
			await db.run("ROLLBACK");
			throw error;
		}
	}

	/**
	 * Remove um produto do banco de dados.
	 * 
	 * @param {number} id - ID do produto a ser removido.
	 * @returns {Promise<void>}
	 */
	async delete(id: number): Promise<void> {
		const db = await getDatabaseConnection();
		// O SQLite com Foreign Keys ativas deletaria em cascata, mas por segurança apagamos os vínculos
		await db.run("DELETE FROM produto_ingredientes WHERE produto_id = ?", [id]);
		await db.run("DELETE FROM produtos_menu WHERE id = ?", [id]);
	}
}
