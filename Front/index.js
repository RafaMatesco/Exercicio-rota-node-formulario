$(document).ready(function () {
    const API_URL = 'http://localhost:3000/api/usuarios';

    const $form = $('#usuarioForm');
    const $nomeInput = $('#nome');
    const $mensagemDiv = $('#mensagem');
    const $usersList = $('#usersList');

    function escapeHtml(str) {
        return $('<div>').text(str).html();
    }

    function carregarUsuarios() {
        $.ajax({
            url: API_URL,
            method: 'GET',
            dataType: 'json',
            success: function (usuarios) {
                renderizarUsuarios(usuarios);
            },
            error: function (err) {
                console.log('Servidor offline ou sem conexão:', err);
            }
        });
    }

    function renderizarUsuarios(usuarios) {
        $usersList.empty();

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            $usersList.html('<li class="empty-users">Nenhum usuário cadastrado ainda.</li>');
            return;
        }

        const itens = usuarios.map(function (u) {
            return `
                <li class="user-card">
                    <span><strong>${escapeHtml(u.nome)}</strong></span>
                    <span class="user-id">ID: ${u.id}</span>
                </li>
            `;
        }).join('');

        $usersList.html(itens);
    }

    $form.on('submit', function (e) {
        e.preventDefault();

        const nome = $nomeInput.val().trim();
        if (!nome) return;

        $mensagemDiv.removeClass('sucesso erro').hide();

        $.ajax({
            url: API_URL,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ nome: nome }),
            dataType: 'json',
            success: function (data) {
                $mensagemDiv
                    .text(`Usuário "${data.nome}" cadastrado com sucesso!`)
                    .removeClass('erro')
                    .addClass('sucesso')
                    .fadeIn();

                $nomeInput.val('');
                carregarUsuarios();
            },
            error: function (jqXHR) {
                const data = jqXHR.responseJSON;
                const erroMsg = (data && data.erro) ? data.erro : 'Erro ao se comunicar com o servidor.';

                $mensagemDiv
                    .text(erroMsg)
                    .removeClass('sucesso')
                    .addClass('erro')
                    .fadeIn();
            }
        });
    });

    carregarUsuarios();
});