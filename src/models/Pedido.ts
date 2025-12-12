/**
 * ============================================================================
 * NOME DO ARQUIVO: Pedido.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Definição das interfaces para o modelo de Pedido e seus itens.
 *            Representa as solicitações feitas pelos clientes.
 * ============================================================================
 */

/**
 * Interface para um item individual dentro de um pedido.
 * Relaciona um produto e sua quantidade.
 */
export interface ItemPedido {
    produto_id: number;
    quantidade: number;
    nome_produto?: string; 
}

/**
 * Interface principal que representa um Pedido.
 * Contém informações da mesa, status, observações e a lista de itens.
 */
export interface Pedido {
    id?: number;
    numero_mesa: number;
    status: 'Recebido' | 'Em Preparo' | 'Pronto' | 'Entregue';
    observacao?: string; // ex: "Sem cebola"
    itens: ItemPedido[]; // Array com os produtos pedidos
    data_hora_criacao?: string;
    data_hora_finalizacao?: string;
}