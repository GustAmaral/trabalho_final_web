/**
 * ============================================================================
 * NOME DO ARQUIVO: index.d.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Arquivo de definição de tipos para estender a interface Request
 *            do Express, adicionando a propriedade 'user' para armazenar
 *            dados do usuário autenticado.
 * ============================================================================
 */

import * as express from 'express';

declare global {
    namespace Express {
        /**
         * Extensão da interface Request do Express.
         * Adiciona a propriedade opcional 'user' que contém o ID e o cargo do usuário.
         * Isso permite que middlewares de autenticação anexem informações do usuário à requisição.
         */
        interface Request {
            user?: {
                id: number;
                cargo: string;
            };
        }
    }
}