/**
 * ============================================================================
 * NOME DO ARQUIVO: Usuario.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Definição da interface para o modelo de Usuário.
 *            Representa os usuários do sistema (administradores e cozinheiros).
 * ============================================================================
 */

/**
 * Interface que representa um usuário do sistema.
 */
export interface Usuario {
    id?: number;
    nome: string;
    email: string;
    senha?: string; 
    cargo?: 'admin' | 'cozinheiro';
}