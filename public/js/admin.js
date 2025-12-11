/**
 * ============================================================================
 * NOME DO ARQUIVO: admin.js
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Script responsável pela lógica da página administrativa (Dashboard).
 *            Gerencia o carregamento do histórico de pedidos concluídos e a
 *            visualização da equipe de cozinha.
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. INICIALIZAÇÃO
 * ============================================================================
 * Executa as configurações iniciais assim que o DOM estiver completamente carregado.
 */
document.addEventListener("DOMContentLoaded", () => {
	// 1. Configurações iniciais (Logout, Nome do usuário)
	configurarCabecalho();

	// 2. Busca os dados reais do banco para o Histórico de Pedidos
	carregarHistoricoReal();

    // 3. Busca os dados reais do banco para a Equipe de Cozinha
	carregarEquipeReal();
});

/**
 * ============================================================================
 * 2. CONFIGURAÇÃO DO CABEÇALHO
 * ============================================================================
 */

/**
 * Configura os elementos do cabeçalho, como botão de logout e exibição do nome do usuário.
 */
function configurarCabecalho() {
	// Configuração do botão de Logout
	const btnLogout = document.getElementById("btn-logout");
	if (btnLogout) {
		btnLogout.addEventListener("click", () => {
			localStorage.clear(); // Limpa dados da sessão
			window.location.href = "index.html"; // Redireciona para login
		});
	}

	// Exibição do Nome do Usuário logado
	const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
	if (usuario.nome) {
		const userDisplay = document.getElementById("user-name");
		if (userDisplay) userDisplay.innerText = `Olá, ${usuario.nome}`;
	}
}

/**
 * ============================================================================
 * 3. HISTÓRICO DE PEDIDOS
 * ============================================================================
 */

/**
 * Busca os pedidos no backend e filtra apenas os concluídos ("Entregue") para exibir no histórico.
 * @async
 */
async function carregarHistoricoReal() {
	const container = document.getElementById("lista-historico");
	const token = localStorage.getItem("token");

	if (!token) {
		container.innerHTML =
			'<p class="text-danger text-center">Erro de autenticação</p>';
		return;
	}

	try {
		// Busca todos os pedidos na API
		const response = await fetch("/api/pedidos", {
			headers: { Authorization: `Bearer ${token}` },
		});

		const pedidos = await response.json();

		// FILTRO: Pega somente os pedidos com status "Entregue" (Concluídos)
		const historico = pedidos.filter((p) => p.status === "Entregue");

		renderizarHistorico(historico);
	} catch (error) {
		console.error("Erro ao carregar histórico:", error);
		container.innerHTML =
			'<p class="text-muted text-center">Não foi possível carregar o histórico.</p>';
	}
}

/**
 * Renderiza a lista de pedidos concluídos no DOM.
 * @param {Array} listaPedidos - Lista de objetos de pedidos filtrados.
 */
function renderizarHistorico(listaPedidos) {
	const container = document.getElementById("lista-historico");
	container.innerHTML = "";

	if (listaPedidos.length === 0) {
		container.innerHTML =
			'<div class="text-center text-muted py-4 small">Nenhum pedido concluído ainda.</div>';
		return;
	}

	listaPedidos.forEach((order) => {
		// Formata o resumo dos pratos para exibição
		const resumoPratos = order.itens
			.map((item) => `${item.quantidade}x ${item.nome_produto}`)
			.join(", ");
            
        // Trunca o texto se for muito longo
		const pratoDisplay =
			resumoPratos.length > 35
				? resumoPratos.substring(0, 35) + "..."
				: resumoPratos;

        // Define a hora de finalização ou criação
		const dataRef = order.data_hora_finalizacao || order.data_hora_criacao;
		const hora = dataRef
			? new Date(dataRef).toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit",
			  })
			: "";

        // Cria o HTML do card de histórico
		const itemHtml = `
            <div class="bg-white p-3 rounded-3 shadow-sm border mb-2 flex-shrink-0"> <div class="d-flex justify-content-between align-items-start">
                    <p class="fw-bold mb-1 text-dark small">Pedido #${order.id}</p>
                    <span class="badge bg-light text-secondary border border-secondary text-dark" style="font-size: 0.7rem;">${hora}</span>
                </div>
                <p class="mb-1 text-secondary small fw-bold" title="${resumoPratos}">${pratoDisplay}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <p class="mb-0 text-muted x-small">Mesa ${order.numero_mesa}</p>
                    <span class="text-success x-small fw-bold"><i class="bi bi-check-all"></i> Concluído</span>
                </div>
            </div>
        `;
		container.innerHTML += itemHtml;
	});
}

/**
 * ============================================================================
 * 4. GESTÃO DA EQUIPE
 * ============================================================================
 */

/**
 * Busca a lista de usuários (cozinheiros) no backend.
 * @async
 */
async function carregarEquipeReal() {
	const container = document.getElementById("grid-equipe");
	const token = localStorage.getItem("token");

	if (!container) return;
	container.innerHTML =
		'<p class="text-muted col-12 text-center">Carregando equipe...</p>';

	try {
		// Busca os usuários (O backend já filtra só cozinheiros)
		const response = await fetch("/api/usuarios", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (!response.ok) throw new Error("Falha ao buscar equipe");

		const equipe = await response.json();
		renderizarEquipe(equipe);
	} catch (error) {
		console.error(error);
		container.innerHTML =
			'<p class="text-danger col-12 text-center">Erro ao carregar equipe.</p>';
	}
}

/**
 * Renderiza os cards dos membros da equipe no DOM.
 * @param {Array} listaEquipe - Lista de objetos de usuários.
 */
function renderizarEquipe(listaEquipe) {
	const container = document.getElementById("grid-equipe");
	container.innerHTML = "";

	if (listaEquipe.length === 0) {
		container.innerHTML =
			'<div class="col-12 text-center text-muted py-4">Nenhum cozinheiro cadastrado.</div>';
		return;
	}

	listaEquipe.forEach((member) => {
		// Cria o HTML do card do membro da equipe
		const cardHtml = `
            <div class="col-sm-6 col-md-4 col-xl-3">
                <div class="bg-white rounded-4 shadow-sm p-4 d-flex flex-column align-items-center justify-content-center border text-center h-100 team-card">
                    <div class="bg-light rounded-circle p-3 mb-3 text-secondary position-relative">
                        <i class="bi bi-person-fill fs-3"></i>
                        <span class="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                            <span class="visually-hidden">Ativo</span>
                        </span>
                    </div>
                    <p class="fw-bold text-dark mb-1">${member.nome}</p>
                    <p class="text-secondary small mb-0 text-capitalize">${member.cargo}</p>
                    <p class="text-muted x-small mt-1">${member.email}</p>
                </div>
            </div>
        `;
		container.innerHTML += cardHtml;
	});
}
