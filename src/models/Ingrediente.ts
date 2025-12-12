/**
 * ============================================================================
 * NOME DO ARQUIVO: Ingrediente.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Definição da interface para o modelo de Ingrediente.
 *            Representa os itens de estoque utilizados na preparação dos produtos.
 * ============================================================================
 */

/**
 * Interface que representa um ingrediente no sistema.
 */
export interface Ingrediente {
    id?: number; 
    nome: string;
    unidade_medida: string;
    quantidade: number;
}