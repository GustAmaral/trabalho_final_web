/**
 * ============================================================================
 * NOME DO ARQUIVO: ProdutoController.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Controlador responsável pelo gerenciamento de produtos do cardápio.
 *            Permite listar, criar, atualizar e deletar produtos, incluindo
 *            a associação com ingredientes.
 * ============================================================================
 */

import { Request, Response } from 'express';
import { ProdutoRepository } from '../repositories/ProdutoRepository';

export class ProdutoController {

    /**
     * Lista todos os produtos do cardápio.
     * 
     * @param {Request} req - Objeto de requisição.
     * @param {Response} res - Objeto de resposta.
     * @returns {Promise<Response>} Retorna lista de produtos.
     */
    async listar(req: Request, res: Response) {
        const repository = new ProdutoRepository();
        const produtos = await repository.findAll();
        return res.json(produtos);
    }

    /**
     * Cria um novo produto no cardápio.
     * Associa os ingredientes informados ao produto criado.
     * 
     * @param {Request} req - Objeto de requisição contendo dados do produto e IDs dos ingredientes.
     * @param {Response} res - Objeto de resposta.
     * @returns {Promise<Response>} Retorna mensagem de sucesso ou erro.
     */
    async criar(req: Request, res: Response) {
        const repository = new ProdutoRepository();
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

    /**
     * Atualiza um produto existente.
     * Atualiza também a lista de ingredientes associados.
     * 
     * @param {Request} req - Objeto de requisição contendo ID e novos dados.
     * @param {Response} res - Objeto de resposta.
     * @returns {Promise<Response>} Retorna mensagem de sucesso ou erro.
     */
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

    /**
     * Remove um produto do cardápio.
     * 
     * @param {Request} req - Objeto de requisição contendo o ID do produto.
     * @param {Response} res - Objeto de resposta.
     * @returns {Promise<Response>} Retorna status 204 (No Content) ou erro.
     */
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