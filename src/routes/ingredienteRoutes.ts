/**
 * ============================================================================
 * NOME DO ARQUIVO: ingredienteRoutes.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Rotas para gerenciamento de ingredientes.
 *            Todas as rotas são protegidas e requerem autenticação e permissão de admin.
 * ============================================================================
 */

import { Router } from 'express';
import { IngredienteController } from '../controllers/IngredienteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';

const router = Router();
const controller = new IngredienteController();

/**
 * Rota GET /
 * Lista todos os ingredientes.
 * Requer: Autenticação + Admin
 */
router.get('/', authMiddleware, isAdminMiddleware, controller.listar);

/**
 * Rota POST /
 * Cria um novo ingrediente.
 * Requer: Autenticação + Admin
 */
router.post('/', authMiddleware, isAdminMiddleware, controller.criar);

/**
 * Rota PUT /:id
 * Atualiza um ingrediente existente.
 * Requer: Autenticação + Admin
 */
router.put('/:id', authMiddleware, isAdminMiddleware, controller.atualizar);

/**
 * Rota DELETE /:id
 * Remove um ingrediente.
 * Requer: Autenticação + Admin
 */
router.delete('/:id', authMiddleware, isAdminMiddleware, controller.deletar);

export { router as ingredienteRoutes };