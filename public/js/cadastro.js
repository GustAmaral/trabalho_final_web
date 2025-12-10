document.addEventListener("DOMContentLoaded", () => {
	const form = document.getElementById("form-cadastro");
	const alerta = document.getElementById("alerta-msg");

	if (form) {
		form.addEventListener("submit", async (e) => {
			e.preventDefault();

			const nome = document.getElementById("nome").value;
			const email = document.getElementById("email").value;
			const cargo = document.getElementById("cargo").value;
			const senha = document.getElementById("senha").value;
			const confirmarSenha = document.getElementById("confirmar-senha").value;

			// 1. Validação local de senha
			if (senha !== confirmarSenha) {
				mostrarAlerta("As senhas não coincidem!", "danger");
				return;
			}

			if (senha.length < 6) {
				mostrarAlerta("A senha deve ter no mínimo 6 caracteres.", "danger");
				return;
			}

			// 2. Envio para a API
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

	function mostrarAlerta(msg, tipo) {
		alerta.textContent = msg;
		alerta.className = `alert alert-${tipo} mt-3 text-center shadow-sm fade-in`;
		alerta.classList.remove("d-none");
	}
});
