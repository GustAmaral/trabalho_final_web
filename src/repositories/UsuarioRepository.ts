import { getDatabaseConnection } from '../config/database';
import { Usuario } from '../models/Usuario';

export class UsuarioRepository {

    async create(usuario: Usuario): Promise<void> {
        const db = await getDatabaseConnection();
        await db.run(
            'INSERT INTO usuarios (nome, email, senha, cargo) VALUES (?, ?, ?, ?)',
            [usuario.nome, usuario.email, usuario.senha, usuario.cargo || 'cozinheiro']
        );
    }

    async findByEmail(email: string): Promise<Usuario | undefined> {
        const db = await getDatabaseConnection();
        return db.get<Usuario>('SELECT * FROM usuarios WHERE email = ?', [email]);
    }

    async findAll(): Promise<Usuario[]> {
        const db = await getDatabaseConnection();
        return db.all<Usuario[]>('SELECT id, nome, email, cargo FROM usuarios');
    }
}