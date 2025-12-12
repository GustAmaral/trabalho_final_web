/**
 * ============================================================================
 * NOME DO ARQUIVO: IngredienteController.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Controlador responsável pelo gerenciamento de ingredientes (CRUD).
 *            Permite listar, criar, atualizar e deletar ingredientes do estoque.
 * ============================================================================
 */

import { Request, Response } from "express";
import { IngredienteRepository } from "../repositories/IngredienteRepository";

export class IngredienteController {
	/**
	 * Lista todos os ingredientes cadastrados.
	 * 
	 * @param {Request} req - Objeto de requisição do Express.
	 * @param {Response} res - Objeto de resposta do Express.
	 * @returns {Promise<Response>} Retorna uma lista JSON de ingredientes.
	 */
	async listar(req: Request, res: Response) {
		const repository = new IngredienteRepository();
		const ingredientes = await repository.findAll();
		return res.json(ingredientes);
	}

	/**
	 * Cria um novo ingrediente.
	 * 
	 * @param {Request} req - Objeto de requisição contendo dados do ingrediente (nome, unidade_medida, quantidade).
	 * @param {Response} res - Objeto de resposta.
	 * @returns {Promise<Response>} Retorna mensagem de sucesso ou erro.
	 */
	async criar(req: Request, res: Response) {
		const repository = new IngredienteRepository();
		const { nome, unidade_medida, quantidade } = req.body; // Pega quantidade

		if (!nome || !unidade_medida) {
			return res.status(400).json({ erro: "Dados incompletos" });
		}

		await repository.create({
			nome,
			unidade_medida,
			quantidade: Number(quantidade) || 0,
		});

		return res.status(201).json({ mensagem: "Ingrediente criado!" });
	}

	/**
	 * Atualiza um ingrediente existente.
	 * 
	 * @param {Request} req - Objeto de requisição contendo ID nos parâmetros e dados no corpo.
	 * @param {Response} res - Objeto de resposta.
	 * @returns {Promise<Response>} Retorna mensagem de sucesso.
	 */
	async atualizar(req: Request, res: Response) {
		const repository = new IngredienteRepository();
		const { id } = req.params;
		const { nome, unidade_medida, quantidade } = req.body;

		await repository.update(Number(id), {
			nome,
			unidade_medida,
			quantidade: Number(quantidade) || 0,
		});
		return res.json({ mensagem: "Ingrediente atualizado!" });
	}

	/**
	 * Remove um ingrediente pelo ID.
	 * 
	 * @param {Request} req - Objeto de requisição contendo o ID do ingrediente.
	 * @param {Response} res - Objeto de resposta.
	 * @returns {Promise<Response>} Retorna status 204 (No Content) em caso de sucesso.
	 */
	async deletar(req: Request, res: Response) {
		const repository = new IngredienteRepository();
		const { id } = req.params;

		await repository.delete(Number(id));
		return res.status(204).send(); // 204 = No Content 
	}
}
