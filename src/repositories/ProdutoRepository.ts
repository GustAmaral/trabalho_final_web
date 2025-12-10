import { getDatabaseConnection } from "../config/database";
import { Produto } from "../models/Produto";

export class ProdutoRepository {
	// Listar Produtos com seus Ingredientes
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

	// Atualizar Produto Completo
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

	async delete(id: number): Promise<void> {
		const db = await getDatabaseConnection();
		// O SQLite com Foreign Keys ativas deletaria em cascata, mas por segurança apagamos os vínculos
		await db.run("DELETE FROM produto_ingredientes WHERE produto_id = ?", [id]);
		await db.run("DELETE FROM produtos_menu WHERE id = ?", [id]);
	}
}
