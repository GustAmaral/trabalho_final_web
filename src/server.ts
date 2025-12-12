/**
 * ============================================================================
 * NOME DO ARQUIVO: server.ts
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Ponto de entrada da aplicação.
 *            Responsável por carregar variáveis de ambiente, inicializar o banco
 *            de dados e iniciar o servidor Express.
 * ============================================================================
 */

import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';

dotenv.config();
const PORT : number = parseInt(`${process.env.PORT || 3000}`);

import app from './app';

/**
 * Função assíncrona para inicialização do servidor.
 * 1. Inicializa a conexão e estrutura do banco de dados.
 * 2. Inicia o servidor Express na porta definida.
 * 
 * Em caso de erro na inicialização do banco, o servidor não é iniciado.
 */
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => console.log(`Servidor está rodando na porta: ${PORT}.`));
    } catch (error) {
        console.error(`Erro ao iniciar o servidor: ${error}`);
    }
};

startServer();