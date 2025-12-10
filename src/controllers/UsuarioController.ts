import { Request, Response } from "express";
import { UsuarioRepository } from "../repositories/UsuarioRepository";

export class UsuarioController {
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
