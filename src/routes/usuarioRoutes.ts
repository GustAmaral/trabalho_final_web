/**
 * ============================================================================
 * NOME DO ARQUIVO: usuarioRoutes.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Rotas para gerenciamento de usuários.
 *            Atualmente permite listar a equipe (apenas para admins).
 * ============================================================================
 */

import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";

const router = Router();
const controller = new UsuarioController();

/**
 * Rota GET /
 * Lista os usuários da equipe (cozinheiros).
 * Requer: Autenticação + Admin
 */
// GET /api/usuarios -> Apenas Admin pode ver a lista
router.get("/", authMiddleware, isAdminMiddleware, controller.listarEquipe);

export { router as usuarioRoutes };
