/**
 * ============================================================================
 * NOME DO ARQUIVO: authMiddleware.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Middleware de autenticação JWT.
 *            Verifica a presença e validade do token JWT no header Authorization.
 *            Se válido, anexa os dados do usuário (id, cargo) ao objeto Request.
 * ============================================================================
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'meu_segredo_super_secreto'; // Mesma string usada no AuthController

interface TokenPayload {
    id: number;
    cargo: string;
    iat: number;
    exp: number;
}

/**
 * Middleware para verificar autenticação via Token JWT.
 * 
 * @param {Request} req - Objeto de requisição do Express.
 * @param {Response} res - Objeto de resposta do Express.
 * @param {NextFunction} next - Função para passar o controle para o próximo middleware.
 * @returns {Response | void} Retorna erro 401 se falhar, ou chama next() se sucesso.
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const [, token] = authorization.split(' ');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Coloca os dados do usuário dentro da requisição para usar depois
        const { id, cargo } = decoded as TokenPayload;
        req.user = { id, cargo };

        return next();
    } catch (error) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }
};