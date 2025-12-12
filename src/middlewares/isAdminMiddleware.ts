/**
 * ============================================================================
 * NOME DO ARQUIVO: isAdminMiddleware.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Middleware de autorização para rotas administrativas.
 *            Verifica se o usuário autenticado possui o cargo de 'admin'.
 * ============================================================================
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para verificar se o usuário é administrador.
 * Deve ser usado APÓS o authMiddleware, pois depende de req.user estar preenchido.
 * 
 * @param {Request} req - Objeto de requisição do Express (deve conter req.user).
 * @param {Response} res - Objeto de resposta do Express.
 * @param {NextFunction} next - Função para passar o controle para o próximo middleware.
 * @returns {Response | void} Retorna erro 403 se não for admin, ou chama next() se for.
 */
export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    // Se chegou até aqui, o usuário já está logado. Vamos checar o cargo.
    if (req.user?.cargo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
    }

    return next();
};