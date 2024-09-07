document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do modal
    const cancelButton = document.getElementById('cancel-appointment-btn');
    const modal = document.getElementById('cancel-modal');
    const span = document.getElementsByClassName('close')[0];
    const form = document.getElementById('cancel-form');

    // Função para abrir o modal ao clicar no botão de cancelamento
    cancelButton.onclick = function() {
        modal.style.display = "block";
    }

    // Função para fechar o modal ao clicar no "x"
    span.onclick = function() {
        modal.style.display = "none";
    }

    // Fecha o modal ao clicar fora dele
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    }

    // Função para enviar o formulário de cancelamento
    form.onsubmit = function(event) {
        event.preventDefault();
        const bookingId = document.getElementById('nome').value;
        const email = document.getElementById('telefone').value;

        // Aqui você pode adicionar a lógica para verificar os dados
        if (bookingId === 'denilson' && email==='11910256247') {
            alert('Agendamento cancelado!');
        } else {
            alert('Não existe um agendamento com esses dados.');
        }

        modal.style.display = "none";
    }
});
