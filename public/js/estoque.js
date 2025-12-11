/**
 * ============================================================================
 * NOME DO ARQUIVO: estoque.js
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Gerencia a página de Estoque (Ingredientes). Permite listar,
 *            adicionar e editar a quantidade de ingredientes disponíveis.
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. INICIALIZAÇÃO
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
	// Carrega a lista de ingredientes ao iniciar
	carregarIngredientes();

	// Configura o formulário do Modal de Edição/Criação
	const form = document.getElementById("form-ingrediente");
	form.addEventListener("submit", salvarIngrediente);
});

/**
 * ============================================================================
 * 2. CARREGAMENTO DE DADOS
 * ============================================================================
 */

/**
 * Busca todos os ingredientes na API e renderiza os cards.
 * @async
 */
async function carregarIngredientes() {
	const token = localStorage.getItem("token");
	try {
		const response = await fetch("/api/ingredientes", {
			headers: { Authorization: `Bearer ${token}` },
		});
		const ingredientes = await response.json();
		renderizarCards(ingredientes);
	} catch (error) {
		console.error("Erro ao carregar:", error);
	}
}

/**
 * ============================================================================
 * 3. RENDERIZAÇÃO
 * ============================================================================
 */

/**
 * Renderiza os cards de ingredientes no grid.
 * @param {Array} ingredientes - Lista de ingredientes retornada da API.
 */
function renderizarCards(ingredientes) {
	const grid = document.getElementById("grid-ingredientes");
	grid.innerHTML = "";

	ingredientes.forEach((ing) => {
		const card = document.createElement("div");
		// Grid responsivo: 1 col (mobile), 2 (sm), 4 (md), 5 (lg)
		card.className = "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2";

		card.innerHTML = `
            <div class="card h-100 border-0 shadow-sm text-center p-3">
                <div class="card-body d-flex flex-column justify-content-center align-items-center">
                    
                    <h5 class="fw-bold mb-1">${ing.nome}</h5>
                    
                    <p class="text-muted mb-4">
                        Qtd.: ${ing.quantidade} ${ing.unidade_medida}
                    </p>

                    <button class="btn btn-dark w-100 btn-sm fw-bold" 
                        onclick='abrirModalEdicao(${JSON.stringify(ing)})'
                        data-bs-toggle="modal" data-bs-target="#modalIngrediente">
                        Alterar Quantidade
                    </button>
                </div>
            </div>
        `;
		grid.appendChild(card);
	});
}

/**
 * ============================================================================
 * 4. AÇÕES DO FORMULÁRIO (CRUD)
 * ============================================================================
 */

/**
 * Prepara o modal para cadastro de um novo ingrediente (limpa campos).
 * Chamado pelo botão "Novo Ingrediente" no HTML.
 */
window.limparFormulario = () => {
	document.getElementById("ingrediente-id").value = "";
	document.getElementById("nome").value = "";
	document.getElementById("quantidade").value = "";
	document.getElementById("unidade").value = "kg";
};

/**
 * Prepara o modal para edição de um ingrediente existente.
 * @param {Object} ingrediente - Objeto do ingrediente a ser editado.
 */
window.abrirModalEdicao = (ingrediente) => {
	document.getElementById("ingrediente-id").value = ingrediente.id;
	document.getElementById("nome").value = ingrediente.nome;
	document.getElementById("quantidade").value = ingrediente.quantidade;
	document.getElementById("unidade").value = ingrediente.unidade_medida;
};

/**
 * Salva (Cria ou Atualiza) um ingrediente.
 * @param {Event} e - Evento de submit do formulário.
 * @async
 */
async function salvarIngrediente(e) {
	e.preventDefault();
	const token = localStorage.getItem("token");

	const id = document.getElementById("ingrediente-id").value;
	const dados = {
		nome: document.getElementById("nome").value,
		quantidade: Number(document.getElementById("quantidade").value),
		unidade_medida: document.getElementById("unidade").value,
	};

	const url = id ? `/api/ingredientes/${id}` : "/api/ingredientes";
	const method = id ? "PUT" : "POST";

	try {
		const response = await fetch(url, {
			method: method,
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(dados),
		});

		if (response.ok) {
			// Fecha o modal
			const modalEl = document.getElementById("modalIngrediente");
			const modalInstance = bootstrap.Modal.getInstance(modalEl);
			modalInstance.hide();

			// Recarrega a lista para mostrar os dados atualizados
			carregarIngredientes();
		} else {
			alert("Erro ao salvar");
		}
	} catch (error) {
		console.error("Erro:", error);
	}
}
