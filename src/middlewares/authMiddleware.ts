import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'meu_segredo_super_secreto'; // Mesma string usada no AuthController

interface TokenPayload {
    id: number;
    cargo: string;
    iat: number;
    exp: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    // O header vem como "Bearer eyJhbGciOi..."
    // Precisamos separar a palavra "Bearer" do token em si
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