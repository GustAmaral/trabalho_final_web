/**
 * ============================================================================
 * NOME DO ARQUIVO: pedidoRoutes.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Rotas para gerenciamento de pedidos.
 *            Permite listar, criar e atualizar o status dos pedidos.
 * ============================================================================
 */

import { Router } from 'express';
import { PedidoController } from '../controllers/PedidoController';

const router = Router();
const controller = new PedidoController();

/**
 * Rota GET /
 * Lista todos os pedidos (usado no Painel da Cozinha).
 */
router.get('/', controller.listar);       // Para o Painel da Cozinha

/**
 * Rota POST /
 * Cria um novo pedido (usado pelo Garçom/Cliente).
 */
router.post('/', controller.criar);       // Para o Garçom/Cliente lançar

/**
 * Rota PUT /:id/status
 * Atualiza o status de um pedido (ex: de 'Recebido' para 'Em Preparo').
 */
router.put('/:id/status', controller.atualizarStatus); // Para mover o card

export { router as pedidoRoutes };