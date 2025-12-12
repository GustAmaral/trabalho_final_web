/**
 * ============================================================================
 * NOME DO ARQUIVO: authRoutes.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Rotas relacionadas à autenticação de usuários.
 *            Define os endpoints para registro e login.
 * ============================================================================
 */

import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const controller = new AuthController();

/**
 * Rota POST /registrar
 * Cria um novo usuário no sistema.
 */
router.post('/registrar', controller.registrar);

/**
 * Rota POST /login
 * Autentica um usuário e retorna um token JWT.
 */
router.post('/login', controller.login);

export { router as authRoutes };