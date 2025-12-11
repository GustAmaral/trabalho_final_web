/**
 * ============================================================================
 * NOME DO ARQUIVO: script.js
 * PROJETO: Trabalho Final Web
 * DESCRIÇÃO: Script genérico para funcionalidades simples ou testes.
 *            Atualmente contém apenas um listener de exemplo.
 * ============================================================================
 */

addEventListener('DOMContentLoaded', () => {
    /**
     * Exemplo de listener para um botão genérico 'btn-finalizar'.
     * Pode ser usado para testes ou funcionalidades futuras.
     */
    const button = document.getElementById('btn-finalizar');
    if (button) {
        button.addEventListener('click', () => {
            alert('Botão clicado!');
        });
    }
});
