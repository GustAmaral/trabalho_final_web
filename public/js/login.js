document.addEventListener("DOMContentLoaded", () => {
	const formLogin = document.getElementById("form-login");
	const alertaErro = document.getElementById("alerta-erro");

	if (formLogin) {
		formLogin.addEventListener("submit", async (event) => {
			event.preventDefault(); // Não recarrega a página

			const email = document.getElementById("email").value;
			const senha = document.getElementById("senha").value;

			try {
				const response = await fetch("/api/auth/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, senha }),
				});

				const data = await response.json();

				if (response.ok) {
					// SUCESSO!
					console.log("Login realizado:", data);

					// 1. Salva o Token e os dados do usuário no localStorage
					localStorage.setItem("token", data.token);
					localStorage.setItem("usuario", JSON.stringify(data.usuario));

					// 2. Redireciona baseada no cargo (Opcional, mas legal)
					// Por enquanto vamos mandar todos para a cozinha
					window.location.href = "cozinha.html";
				} else {
					// ERRO (Senha errada, etc)
					mostrarErro(data.erro || "Falha ao fazer login");
				}
			} catch (error) {
				console.error("Erro na requisição:", error);
				mostrarErro("Erro de conexão com o servidor.");
			}
		});
	}

	function mostrarErro(mensagem) {
		if (alertaErro) {
			alertaErro.textContent = mensagem;
			alertaErro.classList.remove("d-none");
		}
	}
});
