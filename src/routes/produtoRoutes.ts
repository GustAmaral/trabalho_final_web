import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';

const router = Router();
const controller = new ProdutoController();

router.get('/', controller.listar);
router.post('/', authMiddleware, isAdminMiddleware, controller.criar);
// Futuramente: router.put('/:id', controller.editar);

export { router as produtoRoutes };