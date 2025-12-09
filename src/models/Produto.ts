export interface Produto {
	id?: number;
	nome: string;
	descricao: string;
	preco: number;
	disponivel: boolean; // true = disponível, false = esgotado
	ingredientesIds?: number[]; // Lista de IDs dos ingredientes para vincular (Ex: [1, 2])
}