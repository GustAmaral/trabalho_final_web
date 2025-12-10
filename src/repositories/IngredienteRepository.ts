import { getDatabaseConnection } from "../config/database";
import { Ingrediente } from "../models/Ingrediente";

export class IngredienteRepository {
	// Listar todos (para mostrar no Estoque)
	async findAll(): Promise<Ingrediente[]> {
		const db = await getDatabaseConnection();
		return db.all<Ingrediente[]>("SELECT * FROM ingredientes");
	}

	// Criar novo ingrediente
	async create(ingrediente: Ingrediente): Promise<void> {
		const db = await getDatabaseConnection();
		await db.run(
			"INSERT INTO ingredientes (nome, unidade_medida, quantidade) VALUES (?, ?, ?)",
			[
				ingrediente.nome,
				ingrediente.unidade_medida,
				ingrediente.quantidade || 0,
			]
		);
	}

    // Atualizar existente
	async update(id: number, ingrediente: Ingrediente): Promise<void> {
		const db = await getDatabaseConnection();
		await db.run(
			"UPDATE ingredientes SET nome = ?, unidade_medida = ?, quantidade = ? WHERE id = ?",
			[ingrediente.nome, ingrediente.unidade_medida, ingrediente.quantidade, id]
		);
	}

	// Excluir
	async delete(id: number): Promise<void> {
		const db = await getDatabaseConnection();
		await db.run("DELETE FROM ingredientes WHERE id = ?", [id]);
	}
}
