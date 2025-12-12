/**
 * ============================================================================
 * NOME DO ARQUIVO: Produto.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Definição da interface para o modelo de Produto.
 *            Representa os itens disponíveis no cardápio.
 * ============================================================================
 */

import { Ingrediente } from "./Ingrediente";

/**
 * Interface que representa um produto do cardápio.
 * Pode conter uma lista de IDs de ingredientes (para cadastro/edição)
 * ou uma lista de objetos Ingrediente (para visualização).
 */
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