document.addEventListener("DOMContentLoaded", () => {
	// Configura o botão de sair
	document.getElementById("btn-logout").addEventListener("click", () => {
		localStorage.removeItem("token");
		localStorage.removeItem("usuario");
		window.location.href = "index.html";
	});

	// Exibe nome do usuário
	const usuarioLogado = JSON.parse(localStorage.getItem("usuario") || "{}");
	if (usuarioLogado.nome) {
		document.getElementById(
			"user-name-display"
		).textContent = `Olá, ${usuarioLogado.nome}`;
	}

	// Se o cargo for 'admin', mostra o botão de voltar
	if (usuarioLogado.cargo === "admin") {
		const btnAdmin = document.getElementById("btn-voltar-admin");
		if (btnAdmin) {
			btnAdmin.classList.remove("d-none"); // Remove a classe que esconde o botão
		}
	}

	// Inicia o ciclo de atualização
	carregarPedidos();
	setInterval(carregarPedidos, 5000); // Atualiza a cada 5 segundos
});

async function carregarPedidos() {
	const token = localStorage.getItem("token");
	if (!token) return;

	try {
		const response = await fetch("/api/pedidos", {
			headers: { Authorization: `Bearer ${token}` },
		});

		if (response.status === 401) {
			window.location.href = "login.html";
			return;
		}

		const pedidos = await response.json();
		renderizarKanban(pedidos);
	} catch (error) {
		console.error("Erro ao buscar pedidos:", error);
	}
}

function renderizarKanban(pedidos) {
	// Mapeamento das colunas do HTML (certifique-se que o HTML está atualizado com os IDs corretos)
	// Se estiver usando o HTML antigo, os IDs podem ser diferentes.
	// O ideal é usar o HTML atualizado que passei na resposta anterior.
	const colunas = {
		recebido: document.getElementById("coluna-recebido"), // Coluna 1: A preparar
		pronto: document.getElementById("coluna-preparo"), // Coluna 2: Pronto
		concluido: document.getElementById("coluna-pronto"), // Coluna 3: Concluído
	};

	const contadores = {
		recebido: document.getElementById("count-recebido"),
		pronto: document.getElementById("count-preparo"),
		concluido: document.getElementById("count-pronto"),
	};

	// Limpa colunas
	Object.values(colunas).forEach((col) => {
		if (col) col.innerHTML = "";
	});

	let counts = { recebido: 0, pronto: 0, concluido: 0 };

	pedidos.forEach((pedido) => {
		let destino = "";

		// Regra de Negócio Visual:
		// 'Recebido' e 'Em Preparo' ficam na primeira coluna ("A preparar")
		if (pedido.status === "Recebido" || pedido.status === "Em Preparo") {
			destino = "recebido";
			counts.recebido++;
		} else if (pedido.status === "Pronto") {
			destino = "pronto";
			counts.pronto++;
		} else if (pedido.status === "Entregue") {
			destino = "concluido";
			counts.concluido++;
		}

		if (colunas[destino]) {
			colunas[destino].appendChild(criarCardPedido(pedido));
		}
	});

	// Atualiza os contadores
	if (contadores.recebido) contadores.recebido.textContent = counts.recebido;
	if (contadores.pronto) contadores.pronto.textContent = counts.pronto;
	if (contadores.concluido) contadores.concluido.textContent = counts.concluido;
}

function criarCardPedido(pedido) {
	const cardDiv = document.createElement("div");
	// Adiciona classes para estilização
	cardDiv.className = "card kanban-card mb-3 p-3";

	// 1. Definição de Estilos baseada no Status
	let badgeClass = "";
	let badgeText = "";
	let btnTexto = "";
	let proximoStatus = "";

	if (pedido.status === "Recebido") {
		badgeClass = "badge-preparar";
		badgeText = "A preparar";
		btnTexto = "Iniciar Preparo";
		proximoStatus = "Em Preparo";
	} else if (pedido.status === "Em Preparo") {
		badgeClass = "badge-preparar";
		badgeText = "Em andamento";
		btnTexto = "Marcar Pronto";
		proximoStatus = "Pronto";
	} else if (pedido.status === "Pronto") {
		badgeClass = "badge-pronto";
		badgeText = "Pronto";
		btnTexto = "Finalizar";
		proximoStatus = "Entregue";
	} else {
		// Entregue
		badgeClass = "badge-concluido";
		badgeText = "Concluído";
		btnTexto = "";
	}

	// 2. Cálculo do Tempo
	const minutos = calcularTempo(pedido);

	// 3. Montagem da Lista de Itens
	const itensHtml = pedido.itens
		.map(
			(item) => `
        <div class="item-lista">
            <span class="item-qtd fw-bold text-secondary">${item.quantidade}x</span>
            ${item.nome_produto}
        </div>
    `
		)
		.join("");

	const clockIconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" style="width: 1rem; height: 1rem;" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    `;

	// 4. Montagem do HTML
	// Usamos classes do Bootstrap (d-flex, align-items-center, gap-1) para imitar o Tailwind (flex, items-center, gap-1)
	cardDiv.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div class="d-flex align-items-center">
                <span class="card-mesa-title h5 fw-bold mb-0 me-2">Mesa ${
									pedido.numero_mesa
								}</span>
            </div>
            
            <div class="d-flex align-items-center gap-1 small" style="color: #6b7280;"> ${clockIconSvg}
                <span style="font-feature-settings: 'tnum'; font-variant-numeric: tabular-nums;">${minutos}'</span>
            </div>
        </div>

        <div class="status-badge ${badgeClass} text-center mb-3 py-1 rounded fw-bold small">
            ${badgeText}
        </div>

        <div class="mb-3">
            ${itensHtml}
            ${
							pedido.observacao
								? `<div class="mt-2 small text-danger fst-italic"><i class="bi bi-exclamation-circle"></i> ${pedido.observacao}</div>`
								: ""
						}
        </div>

        ${
					btnTexto
						? `
            <button class="btn btn-sm btn-outline-dark w-100 btn-acao" data-id="${pedido.id}" data-status="${proximoStatus}">
                ${btnTexto}
            </button>
        `
						: ""
				}
    `;

	const btn = cardDiv.querySelector(".btn-acao");
	if (btn) {
		btn.addEventListener("click", (e) => {
			e.stopPropagation();
			atualizarStatusPedido(btn.dataset.id, btn.dataset.status);
		});
	}

	return cardDiv;
}

// --- LÓGICA DE TEMPO CORRIGIDA ---
function calcularTempo(pedido) {
	if (!pedido.data_hora_criacao) return 0;

	const inicio = new Date(pedido.data_hora_criacao);
	let fim;

	// Se já foi entregue E o banco retornou a data de finalização, usa ela.
	// Caso contrário (se o pedido está aberto), usa o momento atual (new Date)
	if (pedido.status === "Entregue" && pedido.data_hora_finalizacao) {
		fim = new Date(pedido.data_hora_finalizacao);
	} else {
		fim = new Date();
	}

	// Diferença em milissegundos
	let diffMs = fim - inicio;

	// Converte para minutos arredondando para baixo
	const diffMins = Math.floor(diffMs / 60000);

	return diffMins > 0 ? diffMins : 0;
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
			carregarPedidos();
		} else {
			alert("Erro ao atualizar status");
		}
	} catch (error) {
		console.error("Erro na requisição:", error);
	}
}
