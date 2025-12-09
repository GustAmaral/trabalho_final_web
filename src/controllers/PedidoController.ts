import { Request, Response } from 'express';
import { PedidoRepository } from '../repositories/PedidoRepository';

export class PedidoController {

    async listar(req: Request, res: Response) {
        const repository = new PedidoRepository();
        try {
            const pedidos = await repository.findAll();
            return res.json(pedidos);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar pedidos' });
        }
    }

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