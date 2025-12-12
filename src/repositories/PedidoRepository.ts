/**
 * ============================================================================
 * NOME DO ARQUIVO: PedidoRepository.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Repositório responsável pelo acesso a dados da tabela 'pedidos' e 'itens_pedido'.
 *            Gerencia a criação, listagem e atualização de status dos pedidos.
 * ============================================================================
 */

import { getDatabaseConnection } from "../config/database";
import { Pedido, ItemPedido } from "../models/Pedido";

export class PedidoRepository {
	/**
	 * Lista todos os pedidos, incluindo seus itens detalhados.
	 * Realiza uma busca principal nos pedidos e sub-buscas para os itens.
	 * 
	 * @returns {Promise<Pedido[]>} Lista de pedidos com itens populados.
	 */
	async findAll(): Promise<Pedido[]> {
		const db = await getDatabaseConnection();

		// 1. Busca todos os pedidos 
		const pedidos = await db.all<Pedido[]>(
			"SELECT * FROM pedidos ORDER BY data_hora_criacao DESC"
		);

		// 2. Para cada pedido, busca seus itens 
		for (const pedido of pedidos) {
			const itens = await db.all<ItemPedido[]>(
				`
                SELECT 
                    ip.produto_id, 
                    ip.quantidade, 
                    pm.nome as nome_produto 
                FROM itens_pedido ip
                JOIN produtos_menu pm ON ip.produto_id = pm.id
                WHERE ip.pedido_id = ?
            `,
				[pedido.id]
			);

			pedido.itens = itens;
		}

		return pedidos;
	}

	/**
	 * Cria um novo pedido e seus itens associados.
	 * Utiliza transação para garantir integridade entre pedido e itens.
	 * Registra o preço unitário do produto no momento da compra.
	 * 
	 * @param {Pedido} pedido - Objeto contendo dados do pedido e lista de itens.
	 * @returns {Promise<void>}
	 */
	async create(pedido: Pedido): Promise<void> {
		const db = await getDatabaseConnection();

		try {
			await db.run("BEGIN TRANSACTION");

			// 1. Cria o Pedido
			const result = await db.run(
				"INSERT INTO pedidos (numero_mesa, status, observacao) VALUES (?, ?, ?)",
				[pedido.numero_mesa, "Recebido", pedido.observacao || ""]
			);

			const pedidoId = result.lastID;

			// 2. Insere cada Item do Pedido
			for (const item of pedido.itens) {
				// Buscamos o preço atual do produto para congelar no histórico
				const produto = await db.get(
					"SELECT preco FROM produtos_menu WHERE id = ?",
					[item.produto_id]
				);

				if (produto) {
					await db.run(
						"INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unitario_registro) VALUES (?, ?, ?, ?)",
						[pedidoId, item.produto_id, item.quantidade, produto.preco]
					);
				}
			}

			await db.run("COMMIT");
		} catch (error) {
			await db.run("ROLLBACK");
			throw error;
		}
	}

	/**
	 * Atualiza o status de um pedido.
	 * Se o status for 'Entregue', registra a data/hora de finalização.
	 * 
	 * @param {number} id - ID do pedido.
	 * @param {string} novoStatus - Novo status a ser definido.
	 * @returns {Promise<void>}
	 */
	async updateStatus(id: number, novoStatus: string): Promise<void> {
		const db = await getDatabaseConnection();

		if (novoStatus === "Entregue") {
			// Se for finalizar, grava a data/hora atual (CURRENT_TIMESTAMP)
			await db.run(
				`UPDATE pedidos 
                 SET status = ?, data_hora_finalizacao = CURRENT_TIMESTAMP 
                 WHERE id = ?`,
				[novoStatus, id]
			);
		} else {
			// Se for apenas mover, limpa a finalização 
			await db.run(
				`UPDATE pedidos 
                 SET status = ?, data_hora_finalizacao = NULL 
                 WHERE id = ?`,
				[novoStatus, id]
			);
		}
	}
}
