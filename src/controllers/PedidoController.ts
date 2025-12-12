/**
 * ============================================================================
 * NOME DO ARQUIVO: PedidoController.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Controlador responsável pelo gerenciamento de pedidos.
 *            Permite listar pedidos, criar novos pedidos e atualizar o status.
 * ============================================================================
 */

import { Request, Response } from 'express';
import { PedidoRepository } from '../repositories/PedidoRepository';

export class PedidoController {

    /**
     * Lista todos os pedidos registrados no sistema.
     * 
     * @param {Request} req - Objeto de requisição.
     * @param {Response} res - Objeto de resposta.
     * @returns {Promise<Response>} Retorna lista de pedidos ou erro.
     */
    async listar(req: Request, res: Response) {
        const repository = new PedidoRepository();
        try {
            const pedidos = await repository.findAll();
            return res.json(pedidos);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar pedidos' });
        }
    }

    /**
     * Cria um novo pedido.
     * Recebe o número da mesa, itens do pedido e observações.
     * 
     * @param {Request} req - Objeto de requisição contendo dados do pedido.
     * @param {Response} res - Objeto de resposta.
     * @returns {Promise<Response>} Retorna mensagem de sucesso ou erro.
     */
    async criar(req: Request, res: Response) {
        const repository = new PedidoRepository();
        const { numero_mesa, itens, observacao } = req.body;

        // Validação básica
        if (!numero_mesa || !itens || itens.length === 0) {
            return res.status(400).json({ erro: 'Mesa e itens são obrigatórios' });
        }

        try {
            await repository.create({
                numero_mesa,
                itens,
                observacao,
                status: 'Recebido'
            });
            return res.status(201).json({ mensagem: 'Pedido enviado para a cozinha!' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro ao criar pedido' });
        }
    }

    /**
     * Atualiza o status de um pedido.
     * Status permitidos: 'Recebido', 'Em Preparo', 'Pronto', 'Entregue'.
     * 
     * @param {Request} req - Objeto de requisição contendo ID e novo status.
     * @param {Response} res - Objeto de resposta.
     * @returns {Promise<Response>} Retorna mensagem de sucesso ou erro.
     */
    async atualizarStatus(req: Request, res: Response) {
        const repository = new PedidoRepository();
        const { id } = req.params;
        const { status } = req.body;

        // Validação dos status permitidos
        const statusValidos = ['Recebido', 'Em Preparo', 'Pronto', 'Entregue'];
        if (!statusValidos.includes(status)) {
            return res.status(400).json({ erro: 'Status inválido' });
        }

        try {
            await repository.updateStatus(Number(id), status);
            return res.json({ mensagem: `Status atualizado para ${status}` });
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao atualizar status' });
        }
    }
}