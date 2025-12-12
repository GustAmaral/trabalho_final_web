/**
 * ============================================================================
 * NOME DO ARQUIVO: produtoRoutes.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Rotas para gerenciamento de produtos do cardápio.
 *            A listagem é pública, mas as operações de escrita requerem admin.
 * ============================================================================
 */

import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';

const router = Router();
const controller = new ProdutoController();

/**
 * Rota GET /
 * Lista todos os produtos do cardápio.
 * Acesso público.
 */
router.get('/', controller.listar);

/**
 * Rota POST /
 * Cria um novo produto.
 * Requer: Autenticação + Admin
 */
router.post('/', authMiddleware, isAdminMiddleware, controller.criar);

/**
 * Rota PUT /:id
 * Atualiza um produto existente.
 * Requer: Autenticação + Admin
 */
router.put('/:id', authMiddleware, isAdminMiddleware, controller.atualizar);

/**
 * Rota DELETE /:id
 * Remove um produto.
 * Requer: Autenticação + Admin
 */
router.delete('/:id', authMiddleware, isAdminMiddleware, controller.deletar);

export { router as produtoRoutes };