import { getDatabaseConnection } from "../config/database";
import { Produto } from "../models/Produto";

export class ProdutoRepository {
	async findAll(): Promise<Produto[]> {
		const db = await getDatabaseConnection();
		// Busca simples dos produtos
		return db.all<Produto[]>("SELECT * FROM produtos_menu");
	}

	async create(produto: Produto): Promise<void> {
		const db = await getDatabaseConnection();

		try {
			await db.run("BEGIN TRANSACTION"); // Inicia o bloco de segurança

			// 1. Insere o Produto
			const result = await db.run(
				"INSERT INTO produtos_menu (nome, descricao, preco, disponivel) VALUES (?, ?, ?, ?)",
				[
					produto.nome,
					produto.descricao,
					produto.preco,
					produto.disponivel ? 1 : 0,
				]
			);

			const produtoId = result.lastID; // Pega o ID que acabou de ser gerado

			// 2. Insere os Ingredientes (se houver)
			if (produto.ingredientesIds && produto.ingredientesIds.length > 0) {
				for (const ingredienteId of produto.ingredientesIds) {
					await db.run(
						"INSERT INTO produto_ingredientes (produto_id, ingrediente_id) VALUES (?, ?)",
						[produtoId, ingredienteId]
					);
				}
			}

			await db.run("COMMIT"); // Salva tudo definitivamente
		} catch (error) {
			await db.run("ROLLBACK"); // Se der erro, desfaz tudo
			throw error;
		}
	}

	// Exemplo de atualização simples (só dados do produto por enquanto)
	async updateStatus(id: number, disponivel: boolean): Promise<void> {
		const db = await getDatabaseConnection();
		await db.run("UPDATE produtos_menu SET disponivel = ? WHERE id = ?", [
			disponivel ? 1 : 0,
			id,
		]);
	}
}