
window.onload = function() {
    // Recupera os dados do localStorage
    const usuarioLogado = localStorage.getItem('username');
    const tipoCadastro = localStorage.getItem('tipoCadastro'); // 'normal' ou 'empresa'

if (usuarioLogado && tipoCadastro) {
    // Envia uma requisição ao servidor para buscar os dados completos
    fetch('/api/obterDadosUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuarioLogado, tipoCadastro })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data.usuario);  // Dados do usuário ou empresa
            // Agora você pode exibir as informações do usuário/empresa na interface
        } else {
            console.log('Erro ao obter dados do usuário:', data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao tentar buscar os dados:', error);
    });
} else {
    console.log('Usuário não está logado ou tipoCadastro não encontrado.');
}


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
        localStorage.removeItem('username');
        localStorage.removeItem('tipoCadastro'); // Remove também o tipo de usuário
        window.location.reload();
    };
};