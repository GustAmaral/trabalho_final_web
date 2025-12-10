document.addEventListener("DOMContentLoaded", () => {
	// 1. Configurações iniciais
	configurarCabecalho();

	// 2. Busca os dados reais do banco para o Histórico
	carregarHistoricoReal();

    // 3. Busca os dados reais do banco para a Equipe
	carregarEquipeReal();
});

function configurarCabecalho() {
	// Logout
	const btnLogout = document.getElementById("btn-logout");
	if (btnLogout) {
		btnLogout.addEventListener("click", () => {
			localStorage.clear();
			window.location.href = "index.html";
		});
	}

	// Nome do Usuário
	const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");
	if (usuario.nome) {
		const userDisplay = document.getElementById("user-name");
		if (userDisplay) userDisplay.innerText = `Olá, ${usuario.nome}`;
	}
}

async function carregarHistoricoReal() {
	const container = document.getElementById("lista-historico");
	const token = localStorage.getItem("token");

	if (!token) {
		container.innerHTML =
			'<p class="text-danger text-center">Erro de autenticação</p>';
		return;
	}

	try {
		// Busca todos os pedidos
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

function renderizarHistorico(listaPedidos) {
	const container = document.getElementById("lista-historico");
	container.innerHTML = "";

	if (listaPedidos.length === 0) {
		container.innerHTML =
			'<div class="text-center text-muted py-4 small">Nenhum pedido concluído ainda.</div>';
		return;
	}

	listaPedidos.forEach((order) => {
		// Formata o resumo dos pratos
		const resumoPratos = order.itens
			.map((item) => `${item.quantidade}x ${item.nome_produto}`)
			.join(", ");
		const pratoDisplay =
			resumoPratos.length > 35
				? resumoPratos.substring(0, 35) + "..."
				: resumoPratos;

		const dataRef = order.data_hora_finalizacao || order.data_hora_criacao;
		const hora = dataRef
			? new Date(dataRef).toLocaleTimeString("pt-BR", {
					hour: "2-digit",
					minute: "2-digit",
			  })
			: "";

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

function renderizarEquipe(listaEquipe) {
	const container = document.getElementById("grid-equipe");
	container.innerHTML = "";

	if (listaEquipe.length === 0) {
		container.innerHTML =
			'<div class="col-12 text-center text-muted py-4">Nenhum cozinheiro cadastrado.</div>';
		return;
	}

	listaEquipe.forEach((member) => {
		// Define um ícone ou cor aleatória para o avatar ficar dinâmico (opcional)
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
