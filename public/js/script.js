addEventListener('DOMContentLoaded', () => {
    const button = document.getElementById('btn-finalizar');
    if (button) {
        button.addEventListener('click', () => {
            alert('Botão clicado!');
        });
    }
});