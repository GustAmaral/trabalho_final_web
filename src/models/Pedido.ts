// Interface para o item dentro do pedido
export interface ItemPedido {
    produto_id: number;
    quantidade: number;
    nome_produto?: string; // Opcional, usado apenas na leitura para exibir no Kanban
}

// Interface principal do Pedido
export interface Pedido {
    id?: number;
    numero_mesa: number;
    status: 'Recebido' | 'Em Preparo' | 'Pronto' | 'Entregue';
    observacao?: string; // ex: "Sem cebola"
    itens: ItemPedido[]; // Array com os produtos pedidos
    data_hora_criacao?: string;
}