import { Request, Response } from "express";
import { IngredienteRepository } from "../repositories/IngredienteRepository";

export class IngredienteController {
	async listar(req: Request, res: Response) {
		const repository = new IngredienteRepository();
		const ingredientes = await repository.findAll();
		return res.json(ingredientes);
	}

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

	async deletar(req: Request, res: Response) {
		const repository = new IngredienteRepository();
		const { id } = req.params;

		await repository.delete(Number(id));
		return res.status(204).send(); // 204 = No Content (Sucesso sem corpo)
	}
}
