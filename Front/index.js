$(document).ready(function () {
    const API_URL = 'http://localhost:3000/api/usuarios';

    const $form = $('#usuarioForm');
    const $nomeInput = $('#nome');
    const $btnSalvar = $('#btnSalvar');
    const $btnCancelar = $('#btnCancelar');
    const $mensagemDiv = $('#mensagem');
    const $usersList = $('#usersList');

    let idEdicao = null;

    function escapeHtml(str) {
        return $('<div>').text(str).html();
    }

    function resetarFormulario() {
        idEdicao = null;
        $nomeInput.val('');
        $btnSalvar.text('Cadastrar Usuário');
        $btnCancelar.hide();
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
                    <div class="user-info">
                        <span><strong>${escapeHtml(u.nome)}</strong></span>
                        <span class="user-id">ID: ${u.id}</span>
                    </div>
                    <div class="user-actions">
                        <button type="button" class="btn-editar" data-id="${u.id}" data-nome="${escapeHtml(u.nome)}">Editar</button>
                        <button type="button" class="btn-excluir" data-id="${u.id}">Excluir</button>
                    </div>
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

        const isEdicao = Boolean(idEdicao);
        const url = isEdicao ? `${API_URL}/${idEdicao}` : API_URL;
        const method = isEdicao ? 'PUT' : 'POST';

        $.ajax({
            url: url,
            method: method,
            contentType: 'application/json',
            data: JSON.stringify({ nome: nome }),
            dataType: 'json',
            success: function (data) {
                const msg = isEdicao
                    ? 'Usuário atualizado com sucesso!'
                    : `Usuário "${data.nome}" cadastrado com sucesso!`;

                $mensagemDiv
                    .text(msg)
                    .removeClass('erro')
                    .addClass('sucesso')
                    .fadeIn();

                resetarFormulario();
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

    $usersList.on('click', '.btn-editar', function () {
        idEdicao = $(this).data('id');
        const nome = $(this).data('nome');

        $nomeInput.val(nome).focus();
        $btnSalvar.text('Atualizar Usuário');
        $btnCancelar.show();
    });

    $btnCancelar.on('click', function () {
        resetarFormulario();
    });

    $usersList.on('click', '.btn-excluir', function () {
        const id = $(this).data('id');

        if (!confirm('Deseja realmente excluir este usuário?')) {
            return;
        }

        $.ajax({
            url: `${API_URL}/${id}`,
            method: 'DELETE',
            dataType: 'json',
            success: function () {
                $mensagemDiv
                    .text('Usuário excluído com sucesso!')
                    .removeClass('erro')
                    .addClass('sucesso')
                    .fadeIn();

                if (idEdicao === id) {
                    resetarFormulario();
                }

                carregarUsuarios();
            },
            error: function (jqXHR) {
                const data = jqXHR.responseJSON;
                const erroMsg = (data && data.erro) ? data.erro : 'Erro ao excluir usuário.';

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