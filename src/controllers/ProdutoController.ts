import { Request, Response } from 'express';
import { ProdutoRepository } from '../repositories/ProdutoRepository';

export class ProdutoController {

    async listar(req: Request, res: Response) {
        const repository = new ProdutoRepository();
        const produtos = await repository.findAll();
        return res.json(produtos);
    }

    async criar(req: Request, res: Response) {
        const repository = new ProdutoRepository();
        // AQUI ESTAVA O POSSÍVEL ERRO: Precisamos pegar 'ingredientesIds' do body
        const { nome, descricao, preco, imagem, ingredientesIds } = req.body;

        if (!nome || !preco) {
            return res.status(400).json({ erro: 'Nome e preço são obrigatórios' });
        }

        try {
            await repository.create({
                nome,
                descricao,
                preco,
                imagem,
                disponivel: true,
                ingredientesIds: ingredientesIds || [] 
            });
            return res.status(201).json({ mensagem: 'Produto criado com sucesso!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao criar produto' });
        }
    }

    async atualizar(req: Request, res: Response) {
        const repository = new ProdutoRepository();
        const { id } = req.params;
        const { nome, descricao, preco, imagem, ingredientesIds } = req.body;

        try {
            await repository.update(Number(id), {
                nome,
                descricao,
                preco,
                imagem,
                disponivel: true, // Mantém como true ao editar, ou pegue do body se quiser gerenciar
                ingredientesIds: ingredientesIds || [] // Garante o envio dos ingredientes
            });
            return res.json({ mensagem: 'Produto atualizado!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao atualizar produto' });
        }
    }

    async deletar(req: Request, res: Response) {
        const repository = new ProdutoRepository();
        const { id } = req.params;

        try {
            await repository.delete(Number(id));
            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao deletar produto' });
        }
    }
}