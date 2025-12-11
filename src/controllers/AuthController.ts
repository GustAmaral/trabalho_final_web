import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/UsuarioRepository';

const JWT_SECRET = 'meu_segredo_super_secreto';

export class AuthController {

    // Registrar novo usuário
    async registrar(req: Request, res: Response) {
        const repository = new UsuarioRepository();
        const { nome, email, senha, cargo } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos' });
        }

        // Verifica se já existe
        const usuarioExistente = await repository.findByEmail(email);
        if (usuarioExistente) {
            return res.status(409).json({ erro: 'E-mail já cadastrado' });
        }

        // Criptografa a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        await repository.create({
            nome,
            email,
            senha: senhaHash,
            cargo: cargo || 'cozinheiro'
        });

        return res.status(201).json({ mensagem: 'Usuário criado com sucesso!' });
    }

    // Fazer Login
    async login(req: Request, res: Response) {
        const repository = new UsuarioRepository();
        const { email, senha } = req.body;

        const usuario = await repository.findByEmail(email);

        if (!usuario || !usuario.senha) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
        }

        // Compara a senha enviada com o hash do banco
        const senhaValida = await bcrypt.compare(senha, usuario.senha);

        if (!senhaValida) {
            return res.status(401).json({ erro: 'E-mail ou senha inválidos' });
        }

        // Gera o Token
        const token = jwt.sign(
            { id: usuario.id, cargo: usuario.cargo }, 
            JWT_SECRET, 
            { expiresIn: '1d' } // Expira em 1 dia
        );

        // Retorna infos úteis para o frontend 
        return res.json({
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo
            },
            token
        });
    }
}