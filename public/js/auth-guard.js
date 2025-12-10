(function() {
    const token = localStorage.getItem('token');
    const usuarioString = localStorage.getItem('usuario');
    
    // 1. Verifica Autenticação Básica
    if (!token || !usuarioString) {
        // Salva a página que ele tentou acessar para redirecionar depois (opcional)
        // Mas por segurança, mandamos para o login
        window.location.href = 'login.html';
        return;
    }

    const usuario = JSON.parse(usuarioString);
    const path = window.location.pathname; // Ex: "/estoque.html"

    // 2. Lista de Páginas que SÓ O ADMIN pode acessar
    // Adicione aqui qualquer nova página administrativa que criar
    const paginasRestritasAdmin = [
        'admin.html',
        'estoque.html',
        'cardapio.html',
        'cadastro.html'
    ];

    // 3. Verifica se a página atual é restrita
    const tentandoAcessarAdmin = paginasRestritasAdmin.some(pagina => path.includes(pagina));

    // 4. Lógica de Bloqueio
    if (tentandoAcessarAdmin && usuario.cargo !== 'admin') {
        alert('Acesso Negado: Você não tem permissão de Gerente.');
        
        // Redireciona o intruso de volta para o lugar dele (Cozinha)
        window.location.href = 'cozinha.html';
        return;
    }
})();