import { Router } from "express";
import { UsuarioController } from "../controllers/UsuarioController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";

const router = Router();
const controller = new UsuarioController();

// GET /api/usuarios -> Apenas Admin pode ver a lista
router.get("/", authMiddleware, isAdminMiddleware, controller.listarEquipe);

export { router as usuarioRoutes };
