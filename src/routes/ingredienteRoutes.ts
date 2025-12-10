import { Router } from 'express';
import { IngredienteController } from '../controllers/IngredienteController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { isAdminMiddleware } from '../middlewares/isAdminMiddleware';

const router = Router();
const controller = new IngredienteController();

router.get('/', authMiddleware, isAdminMiddleware, controller.listar);
router.post('/', authMiddleware, isAdminMiddleware, controller.criar);
router.put('/:id', authMiddleware, isAdminMiddleware, controller.atualizar);
router.delete('/:id', authMiddleware, isAdminMiddleware, controller.deletar);

export { router as ingredienteRoutes };