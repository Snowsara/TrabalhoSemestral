window.onload = function() {
    // Verifica se o usuário está logado
    const usuarioLogado = localStorage.getItem('username');

    if (usuarioLogado) {
        // Exibe o nome do usuário e esconde os botões de cadastro/login
        document.getElementById('usernameElement').textContent = usuarioLogado;
        document.getElementById('cadastroBtn').style.display = 'none';
        document.getElementById('loginBtn').style.display = 'none';
        document.getElementById('sairBtn').style.display = 'inline-block';
    } else {
        // Exibe o botão de login e cadastro se não houver usuário logado
        document.getElementById('usernameElement').textContent = 'Anônimo';
        document.getElementById('cadastroBtn').style.display = 'inline-block';
        document.getElementById('loginBtn').style.display = 'inline-block';
        document.getElementById('sairBtn').style.display = 'none';
    }

    // Lógica de logout
    document.getElementById('sairBtn').onclick = function() {
        localStorage.removeItem('username');
        window.location.reload();
    };
};