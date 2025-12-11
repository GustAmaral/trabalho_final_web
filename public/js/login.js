/**
 * ============================================================================
 * NOME DO ARQUIVO: login.js
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Gerencia a autenticação de usuários. Envia as credenciais para a
 *            API, armazena o token JWT e redireciona o usuário com base no cargo.
 * ============================================================================
 */

/**
 * ============================================================================
 * 1. INICIALIZAÇÃO
 * ============================================================================
 */
document.addEventListener("DOMContentLoaded", () => {
	const formLogin = document.getElementById("form-login");
	const alertaErro = document.getElementById("alerta-erro");

	if (formLogin) {
        /**
         * ============================================================================
         * 2. ENVIO DO FORMULÁRIO DE LOGIN
         * ============================================================================
         */
		formLogin.addEventListener("submit", async (event) => {
			event.preventDefault(); // Evita o recarregamento da página

			const email = document.getElementById("email").value;
			const senha = document.getElementById("senha").value;

			try {
				// Envia credenciais para a API
				const response = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, senha }),
				});

				const data = await response.json();

				if (response.ok) {
					console.log("Login realizado:", data);

					// Armazena Token e Dados do Usuário no LocalStorage
					localStorage.setItem("token", data.token);
					localStorage.setItem("usuario", JSON.stringify(data.usuario));

					// Redirecionamento baseado no Cargo (RBAC)
					if (data.usuario.cargo === "admin") {
						// Se for Gerente, vai para o Painel Administrativo
						window.location.href = "admin.html";
					} else {
						// Se for Cozinheiro, vai direto para o Kanban da Cozinha
						window.location.href = "cozinha.html";
					}
				} else {
					// Exibe erro caso as credenciais sejam inválidas
					mostrarErro(data.erro || "Falha ao fazer login");
				}
			} catch (error) {
				console.error("Erro na requisição:", error);
				mostrarErro("Erro de conexão com o servidor.");
			}
		});
	}

    /**
     * ============================================================================
     * 3. FUNÇÕES AUXILIARES
     * ============================================================================
     */

    /**
     * Exibe uma mensagem de erro na tela.
     * @param {string} mensagem - Texto do erro a ser exibido.
     */
	function mostrarErro(mensagem) {
		if (alertaErro) {
			alertaErro.textContent = mensagem;
			alertaErro.classList.remove("d-none");
		}
	}
});
