/**
 * ============================================================================
 * NOME DO ARQUIVO: cadastro.js
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Script responsável pelo formulário de cadastro de novos usuários.
 *            Gerencia a validação de senhas e o envio dos dados para a API.
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. INICIALIZAÇÃO
 * ============================================================================
 * Configura os ouvintes de eventos quando o DOM estiver carregado.
 */
document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("form-cadastro");
	const alerta = document.getElementById("alerta-msg");

	if (form) {
        /**
         * ============================================================================
         * 2. ENVIO DO FORMULÁRIO
         * ============================================================================
         * Intercepta o envio padrão para realizar validações e requisição AJAX.
         */
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

            // Captura os valores dos campos
			const nome = document.getElementById("nome").value;
			const email = document.getElementById("email").value;
			const cargo = document.getElementById("cargo").value;
			const senha = document.getElementById("senha").value;
			const confirmarSenha = document.getElementById("confirmar-senha").value;

			// --- Validação Local ---
            
            // Verifica se as senhas coincidem
			if (senha !== confirmarSenha) {
				mostrarAlerta("As senhas não coincidem!", "danger");
				return;
			}

            // Verifica o tamanho mínimo da senha
			if (senha.length < 6) {
				mostrarAlerta("A senha deve ter no mínimo 6 caracteres.", "danger");
				return;
			}

			// --- Envio para a API ---
			try {
				const response = await fetch("/api/auth/registrar", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ nome, email, senha, cargo }),
				});

				const data = await response.json();

				if (response.ok) {
					mostrarAlerta(
						"Conta criada com sucesso! Redirecionando...",
						"success"
					);

                    // Redireciona para o login após 1.5s
					setTimeout(() => {
						window.location.href = "login.html";
					}, 1500);
				} else {
					mostrarAlerta(data.erro || "Erro ao criar conta.", "danger");
				}
			} catch (error) {
				console.error(error);
				mostrarAlerta("Erro de conexão com o servidor.", "danger");
			}
		});
	}

    /**
     * ============================================================================
     * 3. FUNÇÕES AUXILIARES
     * ============================================================================
     */

    /**
     * Exibe uma mensagem de alerta na tela.
     * @param {string} msg - A mensagem a ser exibida.
     * @param {string} tipo - O tipo de alerta (ex: 'success', 'danger', 'warning').
     */
	function mostrarAlerta(msg, tipo) {
		alerta.textContent = msg;
		alerta.className = `alert alert-${tipo} mt-3 text-center shadow-sm fade-in`;
		alerta.classList.remove("d-none");
	}
});
