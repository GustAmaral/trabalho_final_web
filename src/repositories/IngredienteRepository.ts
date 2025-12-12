/**
 * ============================================================================
 * NOME DO ARQUIVO: IngredienteRepository.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Repositório responsável pelo acesso a dados da tabela 'ingredientes'.
 *            Implementa operações de CRUD (Create, Read, Update, Delete).
 * ============================================================================
 */

import { getDatabaseConnection } from "../config/database";
import { Ingrediente } from "../models/Ingrediente";

export class IngredienteRepository {
	/**
	 * Busca todos os ingredientes cadastrados no banco de dados.
	 * 
	 * @returns {Promise<Ingrediente[]>} Lista de ingredientes.
	 */
	async findAll(): Promise<Ingrediente[]> {
		const db = await getDatabaseConnection();
		return db.all<Ingrediente[]>("SELECT * FROM ingredientes");
	}

	/**
	 * Cria um novo registro de ingrediente.
	 * 
	 * @param {Ingrediente} ingrediente - Objeto contendo os dados do ingrediente.
	 * @returns {Promise<void>}
	 */
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

    /**
     * Atualiza os dados de um ingrediente existente.
     * 
     * @param {number} id - ID do ingrediente a ser atualizado.
     * @param {Ingrediente} ingrediente - Novos dados do ingrediente.
     * @returns {Promise<void>}
     */
	async update(id: number, ingrediente: Ingrediente): Promise<void> {
		const db = await getDatabaseConnection();
		await db.run(
			"UPDATE ingredientes SET nome = ?, unidade_medida = ?, quantidade = ? WHERE id = ?",
			[ingrediente.nome, ingrediente.unidade_medida, ingrediente.quantidade, id]
		);
	}

	/**
	 * Remove um ingrediente do banco de dados.
	 * 
	 * @param {number} id - ID do ingrediente a ser removido.
	 * @returns {Promise<void>}
	 */
	async delete(id: number): Promise<void> {
		const db = await getDatabaseConnection();
		await db.run("DELETE FROM ingredientes WHERE id = ?", [id]);
	}
}
