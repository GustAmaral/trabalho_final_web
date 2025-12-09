import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';

dotenv.config();
const PORT : number = parseInt(`${process.env.PORT || 3000}`);

import app from './app';

// Iniciar o servidor após garantir que o banco de dados está inicializado
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => console.log(`Servidor está rodando na porta: ${PORT}.`));
    } catch (error) {
        console.error(`Erro ao iniciar o servidor: ${error}`);
    }
};

startServer();