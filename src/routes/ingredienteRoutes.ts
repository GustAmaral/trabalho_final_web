import { Router } from 'express';
import { IngredienteController } from '../controllers/IngredienteController';

const router = Router();
const controller = new IngredienteController();

// GET /api/ingredientes
router.get('/', controller.listar);

// POST /api/ingredientes
router.post('/', controller.criar);

// PUT /api/ingredientes/:id
router.put('/:id', controller.atualizar);

// DELETE /api/ingredientes/:id
router.delete('/:id', controller.deletar);

export { router as ingredienteRoutes };