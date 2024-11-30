document.getElementById('loginForm').addEventListener('submit', async function (event) {
    event.preventDefault(); // Previne o comportamento padrão de enviar o formulário

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    console.log('Email:', email);  // Verifica o valor do e-mail
    console.log('Senha:', senha);  // Verifica o valor da senha

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, senha })
    });

    const result = await response.json();

    if (result.success) {
        alert('Login bem-sucedido!');
        window.location.href = "/"; // Caminho da página inicial configurado no backend
    } else {
        alert(result.message); // Mostra a mensagem de erro
    }
});