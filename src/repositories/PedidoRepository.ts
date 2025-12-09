import { getDatabaseConnection } from '../config/database';
import { Pedido, ItemPedido } from '../models/Pedido';

export class PedidoRepository {

    // Listar Pedidos (Com seus itens aninhados)
    async findAll(): Promise<Pedido[]> {
        const db = await getDatabaseConnection();

        // 1. Busca todos os pedidos (cabeçalhos)
        const pedidos = await db.all<Pedido[]>('SELECT * FROM pedidos ORDER BY data_hora_criacao DESC');

        // 2. Para cada pedido, busca seus itens (Isso é necessário para montar o Card do Kanban)
        for (const pedido of pedidos) {
            const itens = await db.all<ItemPedido[]>(`
                SELECT 
                    ip.produto_id, 
                    ip.quantidade, 
                    pm.nome as nome_produto 
                FROM itens_pedido ip
                JOIN produtos_menu pm ON ip.produto_id = pm.id
                WHERE ip.pedido_id = ?
            `, [pedido.id]);
            
            pedido.itens = itens;
        }

        return pedidos;
    }

    // Criar Pedido (Usa Transação para garantir integridade)
    async create(pedido: Pedido): Promise<void> {
        const db = await getDatabaseConnection();

        try {
            await db.run('BEGIN TRANSACTION');

            // 1. Cria o Pedido
            const result = await db.run(
                'INSERT INTO pedidos (numero_mesa, status, observacao) VALUES (?, ?, ?)',
                [pedido.numero_mesa, 'Recebido', pedido.observacao || '']
            );

            const pedidoId = result.lastID;

            // 2. Insere cada Item do Pedido
            for (const item of pedido.itens) {
                // Buscamos o preço atual do produto para congelar no histórico
                const produto = await db.get('SELECT preco FROM produtos_menu WHERE id = ?', [item.produto_id]);
                
                if (produto) {
                    await db.run(
                        'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario_registro) VALUES (?, ?, ?, ?)',
                        [pedidoId, item.produto_id, item.quantidade, produto.preco]
                    );
                }
            }

            await db.run('COMMIT');
        } catch (error) {
            await db.run('ROLLBACK');
            throw error;
        }
    }

    // Atualizar Status (Para mover o card no Kanban)
    async updateStatus(id: number, novoStatus: string): Promise<void> {
        const db = await getDatabaseConnection();
        // Se o status for 'Entregue', poderíamos atualizar a data_hora_finalizacao também
        await db.run(
            'UPDATE pedidos SET status = ? WHERE id = ?',
            [novoStatus, id]
        );
    }
}