/**
 * ============================================================================
 * NOME DO ARQUIVO: auth-guard.js
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Script de segurança executado no carregamento das páginas protegidas.
 *            Verifica se o usuário está logado e se possui permissão para acessar
 *            a página atual.
 * ============================================================================
 */

(function() {
    /**
     * ============================================================================
     * 1. VERIFICAÇÃO DE AUTENTICAÇÃO
     * ============================================================================
     * Checa se existem token e dados de usuário no LocalStorage.
     */
    const token = localStorage.getItem('token');
    const usuarioString = localStorage.getItem('usuario');
    
    // Se não houver token ou usuário, redireciona para o login imediatamente
    if (!token || !usuarioString) {
        // Salva a página que ele tentou acessar para redirecionar depois (opcional)
        // Mas por segurança, mandamos para o login
        window.location.href = 'login.html';
        return;
    }

    /**
     * ============================================================================
     * 2. VERIFICAÇÃO DE AUTORIZAÇÃO (RBAC)
     * ============================================================================
     * Verifica se o usuário tem o cargo necessário para acessar páginas restritas.
     */
    const usuario = JSON.parse(usuarioString);
    const path = window.location.pathname; // Ex: "/estoque.html"

    // Lista de Páginas que SÓ O ADMIN pode acessar
    // Adicione aqui qualquer nova página administrativa que criar
    const paginasRestritasAdmin = [
        'admin.html',
        'estoque.html',
        'cardapio.html',
        'cadastro.html'
    ];

    // Verifica se a página atual está na lista de restritas
    const tentandoAcessarAdmin = paginasRestritasAdmin.some(pagina => path.includes(pagina));

    // Lógica de Bloqueio: Se for página de admin e usuário não for admin
    if (tentandoAcessarAdmin && usuario.cargo !== 'admin') {
        alert('Acesso Negado: Você não tem permissão de Gerente.');
        
        // Redireciona o intruso de volta para o lugar dele (Cozinha)
        window.location.href = 'cozinha.html';
        return;
    }
})();
