/**
 * ============================================================================
 * NOME DO ARQUIVO: app.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Arquivo principal de configuração da aplicação Express.
 *            Configura middlewares, rotas, arquivos estáticos e tratamento de erros.
 * ============================================================================
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { ingredienteRoutes } from './routes/ingredienteRoutes';
import { produtoRoutes } from './routes/produtoRoutes';
import { pedidoRoutes } from './routes/pedidoRoutes';
import { authRoutes } from './routes/authRoutes';
import { usuarioRoutes } from './routes/usuarioRoutes';
 
const app = express();

/**
 * Configuração de Middlewares Básicos
 * - JSON parser para requisições
 */
app.use(express.json());

/**
 * Definição de Rotas da API
 * Mapeia os endpoints para seus respectivos roteadores.
 */
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/pedidos', pedidoRoutes);

/**
 * Configuração de Arquivos Estáticos
 * Serve o conteúdo da pasta 'public' (HTML, CSS, JS do frontend).
 */
app.use(express.static(path.join(__dirname, '../public')));

/**
 * Middlewares de Segurança e Logs
 * - Morgan: Logger de requisições HTTP
 * - Cors: Habilita Cross-Origin Resource Sharing
 * - Helmet: Define headers de segurança HTTP
 */
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());

/**
 * Middleware Global de Tratamento de Erros
 * Captura erros não tratados e retorna status 500.
 */
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(error.message);
});
 
export default app;