import { Request, Response, NextFunction } from 'express';

export const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    
    // Se chegou até aqui, o usuário já está logado. Vamos checar o cargo.
    if (req.user?.cargo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso negado. Apenas administradores.' });
    }

    return next();
};