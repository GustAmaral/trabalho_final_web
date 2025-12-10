import { Ingrediente } from "./Ingrediente";

export interface Produto {
	id?: number;
	nome: string;
	descricao: string;
	preco: number;
	imagem?: string; // URL da foto do produto
	disponivel: boolean; // true = disponível, false = esgotado
	ingredientesIds?: number[]; // Lista de IDs dos ingredientes para vincular (Ex: [1, 2])
	ingredientes?: Ingrediente[]; // Lista de ingredientes detalhados
}