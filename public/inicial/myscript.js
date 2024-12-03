
document.addEventListener('DOMContentLoaded', function () {
    // Recupera os dados do localStorage
    const usuarioLogado = localStorage.getItem('nomedeusuario');
    const tipoCadastro = localStorage.getItem('tipoCadastro'); // 'normal' ou 'empresa'

    if (usuarioLogado) {
        // Exibe o nome do usuário e esconde os botões de cadastro/login
        document.getElementById('usernameElement').textContent = usuarioLogado;
        document.getElementById('cadastroBtn').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('sairBtn').style.display = 'inline-block';

        // Verifica o tipo de usuário e ajusta a visibilidade da aba "Cadastrar Camping"
        if (tipoCadastro === 'empresa') {
            document.getElementById('menuCadastrarCamping').style.display = 'inline-block'; // Exibe para empresa
        } else {
            document.getElementById('menuCadastrarCamping').style.display = 'none'; // Esconde para usuário normal
        }
    } else {
        // Exibe o botão de login e cadastro se não houver usuário logado
        document.getElementById('usernameElement').textContent = 'Anônimo';
        document.getElementById('cadastroBtn').style.display = 'inline-block';
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('sairBtn').style.display = 'none';
        document.getElementById('menuCadastrarCamping').style.display = 'none'; // Esconde a aba de cadastro de camping
    }

    // Lógica de logout
    document.getElementById('sairBtn').onclick = function() {
        localStorage.removeItem('nomedeusuario');
        localStorage.removeItem('tipoCadastro'); // Remove também o tipo de usuário
        window.location.reload();
    };
})
