/**
 * ============================================================================
 * NOME DO ARQUIVO: UsuarioRepository.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Repositório responsável pelo acesso a dados da tabela 'usuarios'.
 *            Gerencia cadastro e consulta de usuários.
 * ============================================================================
 */

import { getDatabaseConnection } from '../config/database';
import { Usuario } from '../models/Usuario';

export class UsuarioRepository {

    /**
     * Cria um novo usuário no sistema.
     * 
     * @param {Usuario} usuario - Objeto contendo dados do usuário (nome, email, senha, cargo).
     * @returns {Promise<void>}
     */
    async create(usuario: Usuario): Promise<void> {
        const db = await getDatabaseConnection();
        await db.run(
            'INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)',
            [usuario.nome, usuario.email, usuario.senha, usuario.cargo || 'cozinheiro']
        );
    }

    /**
     * Busca um usuário pelo e-mail.
     * Utilizado principalmente no processo de login.
     * 
     * @param {string} email - E-mail do usuário.
     * @returns {Promise<Usuario | undefined>} O usuário encontrado ou undefined.
     */
    async findByEmail(email: string): Promise<Usuario | undefined> {
        const db = await getDatabaseConnection();
        return db.get<Usuario>('SELECT * FROM usuarios WHERE email = ?', [email]);
    }

    /**
     * Lista todos os usuários cadastrados.
     * Retorna apenas dados públicos (sem senha).
     * 
     * @returns {Promise<Usuario[]>} Lista de usuários.
     */
    async findAll(): Promise<Usuario[]> {
        const db = await getDatabaseConnection();
        return db.all<Usuario[]>('SELECT id, nome, email, cargo FROM usuarios');
    }
}