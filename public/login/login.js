document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Previne o comportamento padrão de enviar o formulário

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    console.log('Email:', email);  // Verifica o valor do e-mail
    console.log('Senha:', senha);  // Verifica o valor da senha

    try {
        // Envia os dados de login para a API
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });

        // Verifica se a resposta foi bem-sucedida
        const data = await response.json();

        if (data.success) {
            // Armazena os dados no localStorage
            localStorage.setItem('nomedeusuario', data.nomedeusuario);
            localStorage.setItem('tipoCadastro', data.tipoCadastro);

            alert('Login bem-sucedido!');
            window.location.href = "/"; // Caminho da página inicial configurado no backend
        } else {
            alert(data.message); // Mostra a mensagem de erro
        }

    } catch (error) {
        // Caso haja algum erro na requisição
        console.error('Erro ao realizar o login:', error);
        alert('Ocorreu um erro ao tentar fazer login. Tente novamente.');
    }
});
