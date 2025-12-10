document.addEventListener("DOMContentLoaded", () => {
	const API_URL = "/api/pedidos";

	// Configura o botão de sair
	document.getElementById("btn-logout").addEventListener("click", () => {
		localStorage.removeItem("token");
		localStorage.removeItem("usuario");
		window.location.href = "login.html";
	});

	// Exibe nome do usuário
	const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
	if (usuarioLogado.nome) {
		document.getElementById(
			"user-name-display"
		).textContent = `Olá, ${usuarioLogado.nome}`;
	}

	// Inicia o ciclo de atualização
	carregarPedidos();
	setInterval(carregarPedidos, 5000); // Atualiza a cada 5 segundos (Polling)
});

async function carregarPedidos() {
	const token = localStorage.getItem("token");
	if (!token) return;

	try {
		const response = await fetch("/api/pedidos", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (response.status === 401) {
			window.location.href = "login.html"; // Token expirou
			return;
		}

		const pedidos = await response.json();
		renderizarKanban(pedidos);
	} catch (error) {
		console.error("Erro ao buscar pedidos:", error);
	}
}

function renderizarKanban(pedidos) {
	// Limpa as colunas antes de redesenhar (para não duplicar)
	const colunas = {
		Recebido: document.getElementById("coluna-recebido"),
		"Em Preparo": document.getElementById("coluna-preparo"),
		Pronto: document.getElementById("coluna-pronto"),
		Entregue: document.getElementById("coluna-entregue"),
	};

	const contadores = {
		Recebido: document.getElementById("count-recebido"),
		"Em Preparo": document.getElementById("count-preparo"),
		Pronto: document.getElementById("count-pronto"),
	};

	// Zera HTML das colunas
	Object.values(colunas).forEach((col) => {
		if (col) col.innerHTML = "";
	});

	// Itera sobre os pedidos e cria os cards
	pedidos.forEach((pedido) => {
		const card = criarCardPedido(pedido);

		if (colunas[pedido.status]) {
			colunas[pedido.status].appendChild(card);
		}
	});

	// Atualiza contadores (Badges)
	Object.keys(contadores).forEach((status) => {
		const count = pedidos.filter((p) => p.status === status).length;
		if (contadores[status]) contadores[status].textContent = count;
	});
}

function criarCardPedido(pedido) {
	const cardDiv = document.createElement("div");
	cardDiv.className = "card mb-3 border-0 shadow-sm pedido-card fade-in";

	// Define a cor da borda lateral baseada no status
	let borderClass = "border-start border-4 ";
	let btnAcao = "";

	if (pedido.status === "Recebido") {
		borderClass += "border-danger";
		// Botão para mover para "Em Preparo"
		btnAcao = `<button class="btn btn-sm btn-warning w-100 fw-bold mt-2 btn-mudar-status" data-id="${pedido.id}" data-status="Em Preparo">
                    <i class="bi bi-fire"></i> Iniciar Preparo
                   </button>`;
	} else if (pedido.status === "Em Preparo") {
		borderClass += "border-warning";
		// Botão para mover para "Pronto"
		btnAcao = `<button class="btn btn-sm btn-success w-100 fw-bold mt-2 btn-mudar-status" data-id="${pedido.id}" data-status="Pronto">
                    <i class="bi bi-check-lg"></i> Marcar Pronto
                   </button>`;
	} else if (pedido.status === "Pronto") {
		borderClass += "border-success";
		// Botão para finalizar (Entregue)
		btnAcao = `<button class="btn btn-sm btn-outline-secondary w-100 mt-2 btn-mudar-status" data-id="${pedido.id}" data-status="Entregue">
                    <i class="bi bi-box-seam"></i> Finalizar
                   </button>`;
	} else {
		borderClass += "border-secondary"; // Entregue
	}

	cardDiv.classList.add(borderClass);

	// Formata a lista de itens
	const itensHtml = pedido.itens
		.map(
			(item) =>
				`<li class="list-group-item d-flex justify-content-between align-items-center px-0 py-1 border-0">
            <span><strong class="text-primary-gastro">${item.quantidade}x</strong> ${item.nome_produto}</span>
        </li>`
		)
		.join("");

	// Monta o HTML interno do Card
	cardDiv.innerHTML = `
        <div class="card-body p-3">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h6 class="card-title fw-bold mb-0">Mesa ${
									pedido.numero_mesa
								}</h6>
                <small class="text-muted"><i class="bi bi-clock"></i> ${formatarHora(
									pedido.data_hora_criacao
								)}</small>
            </div>
            
            ${
							pedido.observacao
								? `<div class="alert alert-warning py-1 px-2 mb-2 small"><i class="bi bi-exclamation-circle"></i> ${pedido.observacao}</div>`
								: ""
						}
            
            <ul class="list-group list-group-flush mb-2 small">
                ${itensHtml}
            </ul>

            ${btnAcao}
        </div>
    `;

	// Adiciona o evento de click no botão recém-criado (Solução Segura CSP)
	const btn = cardDiv.querySelector(".btn-mudar-status");
	if (btn) {
		btn.addEventListener("click", () => {
			atualizarStatusPedido(
				btn.getAttribute("data-id"),
				btn.getAttribute("data-status")
			);
		});
	}

	return cardDiv;
}

async function atualizarStatusPedido(id, novoStatus) {
	const token = localStorage.getItem("token");
	try {
		const response = await fetch(`/api/pedidos/${id}/status`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ status: novoStatus }),
		});

		if (response.ok) {
			carregarPedidos(); // Recarrega a tela imediatamente
		} else {
			alert("Erro ao atualizar status");
		}
	} catch (error) {
		console.error("Erro na requisição:", error);
	}
}

function formatarHora(dataString) {
	if (!dataString) return "";
	const data = new Date(dataString); // O SQLite salva em UTC geralmente
	return data.toLocaleTimeString("pt-BR", {
		hour: "2-digit",
		minute: "2-digit",
	});
}
