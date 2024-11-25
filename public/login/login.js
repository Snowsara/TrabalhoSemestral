document.addEventListener("DOMContentLoaded", function() {
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const loginForm = document.getElementById("loginForm");
    
    let validEmail = false;
    let validSenha = false;
    let msgError = document.querySelector('#msgError');
    let msgSuccess = document.querySelector('#msgSuccess');

    email.addEventListener('keyup', () => {
        if (email.value.length <= 4) {
            email.setAttribute('style', 'border-color: red');
            validEmail = false;
            msgError.innerHTML = 'Email *Insira no mínimo 6 caracteres';
            msgError.style.display = 'block';
        } else {
            email.setAttribute('style', 'border-color: green');
            validEmail = true;
            msgError.style.display = 'none';
        }
    });

    senha.addEventListener('keyup', () => {
        if (senha.value.length <= 5) {
            senha.setAttribute('style', 'border-color: red');
            validSenha = false;
            msgError.innerHTML = 'Senha *Insira no mínimo 6 caracteres';
            msgError.style.display = 'block';
        } else {
            senha.setAttribute('style', 'border-color: green');
            validSenha = true;
            msgError.style.display = 'none';
        }
    });

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        if (validEmail && validSenha) {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.value, senha: senha.value })
                });

                const data = await response.json();

                if (data.success) {
                    msgSuccess.setAttribute('style', 'display: block');
                    msgSuccess.innerHTML = '<strong>Logando...</strong>';
                    msgError.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = '/inicial/index.html';
                    }, 3000);
                } else {
                    msgError.setAttribute('style', 'display: block; color: red;');
                    msgError.innerHTML = '<strong>Email ou senha incorretos!</strong>';
                    msgSuccess.style.display = 'none';
                }
            } catch (error) {
                console.error('Erro ao realizar o login', error);
                msgError.setAttribute('style', 'display: block; color: red;');
                msgError.innerHTML = '<strong>Erro ao tentar realizar o login!</strong>';
                msgSuccess.style.display = 'none';
            }
        }
    });
});

