/**
 * ============================================================================
 * NOME DO ARQUIVO: UsuarioController.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Controlador responsável pelo gerenciamento de usuários.
 *            Atualmente focado na listagem da equipe de cozinha.
 * ============================================================================
 */

import { Request, Response } from "express";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

export class UsuarioController {
	/**
	 * Lista os membros da equipe (usuários com cargo 'cozinheiro').
	 * Filtra os usuários retornados pelo repositório para exibir apenas cozinheiros.
	 * 
	 * @param {Request} req - Objeto de requisição.
	 * @param {Response} res - Objeto de resposta.
	 * @returns {Promise<Response>} Retorna lista de cozinheiros ou erro.
	 */
	async listarEquipe(req: Request, res: Response) {
		const repository = new UsuarioRepository();

		try {
			const todosUsuarios = await repository.findAll();

			// FILTRO: Apenas cozinheiros (ignorando admins)
			const equipe = todosUsuarios.filter((u) => u.cargo === "cozinheiro");

			return res.json(equipe);
		} catch (error) {
			console.error(error);
			return res.status(500).json({ erro: "Erro ao buscar equipe" });
		}
	}
}
