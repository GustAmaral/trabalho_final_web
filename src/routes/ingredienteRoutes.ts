import { Router } from 'express';
import { IngredienteController } from '../controllers/IngredienteController';

const router = Router();
const controller = new IngredienteController();

router.get('/', controller.listar);
router.post('/', controller.criar);
router.put('/:id', controller.atualizar);
router.delete('/:id', controller.deletar);

export { router as ingredienteRoutes };