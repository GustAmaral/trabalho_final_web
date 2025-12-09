import { Router } from 'express';
import { ProdutoController } from '../controllers/ProdutoController';

const router = Router();
const controller = new ProdutoController();

router.get('/', controller.listar);
router.post('/', controller.criar);
// Futuramente: router.put('/:id', controller.editar);

export { router as produtoRoutes };