import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import path from 'path';
import { ingredienteRoutes } from './routes/ingredienteRoutes';
 
const app = express();

// Middleware
app.use(express.json());

// Rotas
app.use('/api/ingredientes', ingredienteRoutes);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Segurança e logs
app.use(morgan('tiny'));
app.use(cors());
app.use(helmet());

// Tratamento de erros
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(error.message);
});
 
export default app;