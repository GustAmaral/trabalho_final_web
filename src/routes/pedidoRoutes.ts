import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';

const router = Router();
const controller = new PedidoController();

router.get('/', controller.listar);       // Para o Painel da Cozinha
router.post('/', controller.criar);       // Para o Garçom/Cliente lançar
router.put('/:id/status', controller.atualizarStatus); // Para mover o card

export { router as pedidoRoutes };