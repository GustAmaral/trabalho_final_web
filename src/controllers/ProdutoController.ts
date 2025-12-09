import { Request, Response } from "express";
import { ProdutoRepository } from "../repositories/ProdutoRepository";

export class ProdutoController {
	async listar(req: Request, res: Response) {
		const repository = new ProdutoRepository();
		const produtos = await repository.findAll();
		return res.json(produtos);
	}

	async criar(req: Request, res: Response) {
		const repository = new ProdutoRepository();
		const { nome, descricao, preco, ingredientesIds } = req.body;

		// Validação básica
		if (!nome || !preco) {
			return res.status(400).json({ erro: "Nome e preço são obrigatórios" });
		}

		try {
			await repository.create({
				nome,
				descricao,
				preco,
				disponivel: true,
				ingredientesIds,
			});
			return res.status(201).json({ mensagem: "Produto criado com sucesso!" });
		} catch (error) {
			console.error(error);
			return res.status(500).json({ erro: "Erro ao criar produto" });
		}
	}
}
