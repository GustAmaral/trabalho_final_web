document.addEventListener("DOMContentLoaded", () => {
	carregarProdutos();
	carregarIngredientesParaModal();

	document
		.getElementById("form-produto")
		.addEventListener("submit", salvarProduto);
});

// --- CARREGAMENTO ---
async function carregarProdutos() {
	const token = localStorage.getItem("token");
	const res = await fetch("/api/produtos", {
		headers: { Authorization: `Bearer ${token}` },
	});
	const produtos = await res.json();
	renderizarGrid(produtos);
}

async function carregarIngredientesParaModal() {
	const token = localStorage.getItem("token");
	const res = await fetch("/api/ingredientes", {
		headers: { Authorization: `Bearer ${token}` },
	});
	const ingredientes = await res.json();

	const container = document.getElementById("lista-selecao-ingredientes");
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

function renderizarGrid(produtos) {
	const grid = document.getElementById("grid-produtos");
	grid.innerHTML = "";

	produtos.forEach((prod) => {
		const card = document.createElement("div");
		card.className = "col-md-6 col-lg-4 col-xl-3";

		// Imagem padrão caso não tenha
		const imgUrl =
			prod.imagem || "https://cdn-icons-png.flaticon.com/512/706/706164.png";

		// Lógica de Ingredientes (Lista)
		const listaIngredientes =
			prod.ingredientes && prod.ingredientes.length > 0
				? `<ul class="small text-muted mb-0 ps-3 mt-2">
                ${prod.ingredientes.map((i) => `<li>${i.nome} </li>`).join("")}
               </ul>`
				: '<p class="small text-muted mt-2 fst-italic">Sem ingredientes vinculados</p>';

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

// --- AÇÕES DO FORMULÁRIO ---
window.prepararNovoProduto = () => {
	document.getElementById("prod-id").value = "";
	document.getElementById("form-produto").reset();
	// Limpa checkboxes
	document
		.querySelectorAll("#lista-selecao-ingredientes input")
		.forEach((c) => (c.checked = false));
};

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

async function salvarProduto(e) {
	e.preventDefault();
	const token = localStorage.getItem("token");
	const id = document.getElementById("prod-id").value;

	// Coleta IDs dos ingredientes marcados
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

window.deletarProduto = async (id) => {
	if (!confirm("Tem certeza? Isso apagará o prato do cardápio.")) return;

	const token = localStorage.getItem("token");
	await fetch(`/api/produtos/${id}`, {
		method: "DELETE",
		headers: { Authorization: `Bearer ${token}` },
	});
	carregarProdutos();
};
