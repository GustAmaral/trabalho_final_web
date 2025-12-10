// Verifica se existe token ao carregar a página
(function() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
    }
})();