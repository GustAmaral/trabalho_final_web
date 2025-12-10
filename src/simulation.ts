// src/simulation.ts

// Configuração
const API_URL = 'http://localhost:3000/api';
const INTERVALO_SEGUNDOS = 10; // Cria um pedido a cada 10 segundos

// Dados aleatórios para dar "vida" aos pedidos
const observacoes = [
    'Sem cebola', 
    'Bem passado', 
    'Capricha no molho', 
    'Tirar o tomate', 
    'Bebida sem gelo', 
    'Para viagem', 
    'Cliente alérgico a glúten',
    '', '', '', '', '' // Vários vazios para nem sempre ter observação
];

// Helper para números aleatórios
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomItem = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

async function iniciarSimulacao() {
    console.log('🤖 INICIANDO SIMULAÇÃO DO GASTROFLOW...');
    console.log('---------------------------------------');

    // 1. Busca os produtos disponíveis no cardápio
    let produtos = [];
    try {
        const response = await fetch(`${API_URL}/produtos`);
        produtos = await response.json();
        
        if (produtos.length === 0) {
            console.error('❌ ERRO: O cardápio está vazio! Cadastre pratos antes de rodar a simulação.');
            process.exit(1);
        }
        console.log(`✅ Cardápio carregado com ${produtos.length} pratos.`);

    } catch (error) {
        console.error('❌ Erro ao conectar com o servidor. O projeto está rodando? (npm run dev)');
        process.exit(1);
    }

    // 2. Loop Infinito de Pedidos
    setInterval(async () => {
        const mesa = randomInt(1, 20); // Mesas de 1 a 20
        const qtdItens = randomInt(1, 4); // Pedido com 1 a 4 pratos diferentes
        const itensPedido = [];

        // Escolhe pratos aleatórios
        for (let i = 0; i < qtdItens; i++) {
            const produto = randomItem(produtos);
            itensPedido.push({
                produto_id: produto.id,
                quantidade: randomInt(1, 2) // 1 ou 2 unidades desse prato
            });
        }

        const novoPedido = {
            numero_mesa: mesa,
            observacao: randomItem(observacoes),
            itens: itensPedido
        };

        // 3. Envia para a API
        try {
            const res = await fetch(`${API_URL}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novoPedido)
            });

            if (res.ok) {
                const data = await res.json();
                console.log(`🚀 [Mesa ${mesa}] Pedido enviado! (${qtdItens} itens)`);
            } else {
                console.log('⚠️ Erro ao enviar pedido:', res.statusText);
            }
        } catch (error) {
            console.error('❌ Erro de conexão ao enviar pedido.');
        }

    }, INTERVALO_SEGUNDOS * 1000);
}

// Inicia
iniciarSimulacao();