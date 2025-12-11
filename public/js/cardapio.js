/**
 * ============================================================================
 * NOME DO ARQUIVO: cardapio.js
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Gerencia a página de Cardápio (Produtos). Permite listar, criar,
 *            editar e excluir pratos, além de vincular ingredientes a eles.
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. INICIALIZAÇÃO
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
	// Carrega a lista de produtos e os ingredientes para o modal de cadastro
	carregarProdutos();
	carregarIngredientesParaModal();

	// Configura o envio do formulário de produto
	document
		.getElementById("form-produto")
		.addEventListener("submit", salvarProduto);
});

/**
 * ============================================================================
 * 2. CARREGAMENTO DE DADOS
 * ============================================================================
 */

/**
 * Busca todos os produtos na API e renderiza na tela.
 * @async
 */
async function carregarProdutos() {
	const token = localStorage.getItem("token");
	const res = await fetch("/api/produtos", {
		headers: { Authorization: `Bearer ${token}` },
	});
	const produtos = await res.json();
	renderizarGrid(produtos);
}

/**
 * Busca os ingredientes disponíveis para preencher as opções no modal de produto.
 * @async
 */
async function carregarIngredientesParaModal() {
	const token = localStorage.getItem("token");
	const res = await fetch("/api/ingredientes", {
		headers: { Authorization: `Bearer ${token}` },
	});
	const ingredientes = await res.json();

	const container = document.getElementById("lista-selecao-ingredientes");
	
    // Gera os checkboxes para cada ingrediente
	container.innerHTML = ingredientes
		.map(
			(ing) => `
        <div class="col-md-4 col-sm-6">
            <div class="form-check p-2 border rounded bg-white">
                <input class="form-check-input ms-1" type="checkbox" value="${ing.id}" id="check-ing-${ing.id}">
                <label class="form-check-label w-100 ps-2" for="check-ing-${ing.id}" style="cursor: pointer;">
                    ${ing.nome} <small class="text-muted">(${ing.unidade_medida})</small>
                </label>
            </div>
        </div>
    `
		)
		.join("");
}

/**
 * ============================================================================
 * 3. RENDERIZAÇÃO
 * ============================================================================
 */

/**
 * Renderiza os cards de produtos no grid.
 * @param {Array} produtos - Lista de produtos retornada da API.
 */
function renderizarGrid(produtos) {
	const grid = document.getElementById("grid-produtos");
	grid.innerHTML = "";

	produtos.forEach((prod) => {
		const card = document.createElement("div");
		card.className = "col-md-6 col-lg-4 col-xl-3";

		// Imagem padrão caso não tenha
		const imgUrl =
			prod.imagem || "https://cdn-icons-png.flaticon.com/512/706/706164.png";

		// Monta a lista de ingredientes vinculados (HTML)
		const listaIngredientes =
			prod.ingredientes && prod.ingredientes.length > 0
				? `<ul class="small text-muted mb-0 ps-3 mt-2">
                ${prod.ingredientes.map((i) => `<li>${i.nome} </li>`).join("")}
               </ul>`
				: '<p class="small text-muted mt-2 fst-italic">Sem ingredientes vinculados</p>';

        // HTML do Card do Produto
		card.innerHTML = `
            <div class="card h-100 border-0 shadow-sm text-center p-3">
                <div class="d-flex justify-content-center mt-2">
                    <img src="${imgUrl}" class="rounded-circle shadow-sm object-fit-cover" 
                         style="width: 120px; height: 120px; border: 4px solid #fff;">
                </div>
                
                <div class="card-body">
                    <h5 class="fw-bold mb-1">${prod.nome}</h5>
                    <h6 class="text-primary-gastro fw-bold mb-3">R$ ${prod.preco.toFixed(
											2
										)}</h6>
                    
                    <button class="btn btn-dark w-100 btn-sm mb-2" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#ing-list-${
															prod.id
														}">
                        Mostrar/Esconder Ingredientes
                    </button>
                    
                    <div class="collapse text-start bg-light p-2 rounded" id="ing-list-${
											prod.id
										}">
                        <strong class="small d-block mb-1">Ingredientes:</strong>
                        ${listaIngredientes}
                    </div>

                    <div class="mt-3 d-flex gap-2">
                         <button class="btn btn-outline-secondary btn-sm flex-grow-1" onclick='editarProduto(${JSON.stringify(
														prod
													)})' 
                                 data-bs-toggle="modal" data-bs-target="#modalProduto">Editar</button>
                         <button class="btn btn-outline-danger btn-sm" onclick="deletarProduto(${
														prod.id
													})"><i class="bi bi-trash"></i></button>
                    </div>
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
 * Prepara o modal para cadastro de um novo produto (limpa campos).
 * Chamado pelo botão "Novo Prato" no HTML.
 */
window.prepararNovoProduto = () => {
	document.getElementById("prod-id").value = "";
	document.getElementById("form-produto").reset();
	// Limpa checkboxes de ingredientes
	document
		.querySelectorAll("#lista-selecao-ingredientes input")
		.forEach((c) => (c.checked = false));
};

/**
 * Prepara o modal para edição de um produto existente.
 * @param {Object} prod - Objeto do produto a ser editado.
 */
window.editarProduto = (prod) => {
	document.getElementById("prod-id").value = prod.id;
	document.getElementById("nome").value = prod.nome;
	document.getElementById("preco").value = prod.preco;
	document.getElementById("descricao").value = prod.descricao || "";
	document.getElementById("imagem").value = prod.imagem || "";

	// Marca os checkboxes dos ingredientes que o prato já tem
	const idsVinculados = prod.ingredientes
		? prod.ingredientes.map((i) => i.id)
		: [];
	document
		.querySelectorAll("#lista-selecao-ingredientes input")
		.forEach((check) => {
			check.checked = idsVinculados.includes(parseInt(check.value));
		});
};

/**
 * Salva (Cria ou Atualiza) um produto.
 * @param {Event} e - Evento de submit do formulário.
 * @async
 */
async function salvarProduto(e) {
	e.preventDefault();
	const token = localStorage.getItem("token");
	const id = document.getElementById("prod-id").value;

	// Coleta IDs dos ingredientes marcados no modal
	const ingredientesIds = Array.from(
		document.querySelectorAll("#lista-selecao-ingredientes input:checked")
	).map((cb) => parseInt(cb.value));

	const dados = {
		nome: document.getElementById("nome").value,
		preco: parseFloat(document.getElementById("preco").value),
		descricao: document.getElementById("descricao").value,
		imagem: document.getElementById("imagem").value,
		ingredientesIds: ingredientesIds,
	};

	const url = id ? `/api/produtos/${id}` : "/api/produtos";
	const method = id ? "PUT" : "POST";

	const res = await fetch(url, {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(dados),
	});

	if (res.ok) {
		bootstrap.Modal.getInstance(document.getElementById("modalProduto")).hide();
		carregarProdutos();
	} else {
		alert("Erro ao salvar produto");
	}
}

/**
 * Exclui um produto.
 * @param {number} id - ID do produto a ser excluído.
 * @async
 */
window.deletarProduto = async (id) => {
	if (!confirm("Tem certeza? Isso apagará o prato do cardápio.")) return;

	const token = localStorage.getItem("token");
	await fetch(`/api/produtos/${id}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});
	carregarProdutos();
};
