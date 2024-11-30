document.getElementById('tipoCadastro').addEventListener('change', function () {
    const isEmpresa = this.value === 'empresa';
    document.getElementById('cadastroForm').style.display = isEmpresa ? 'none' : 'block';
    document.getElementById('cadastroEmpresa').style.display = isEmpresa ? 'block' : 'none';
});

// Envio do formulário de usuário
document.querySelector('#cadastroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const response = await fetch('/api/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'usuario',
                nomec: document.querySelector('#nomec').value,
                nomedeusuario: document.querySelector('#nomedeusuario').value,
                email: document.querySelector('#email').value,
                senha: document.querySelector('#senha').value,
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Usuário cadastrado com sucesso!');
            window.location.href = '/login';
        } else {
            alert('Erro ao cadastrar usuário: ' + data.message);
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao cadastrar usuário!');
    }
});

// Envio do formulário de empresa
document.querySelector('#cadastroEmpresa').addEventListener('submit', async function (event) {
    event.preventDefault();

    try {
        const response = await fetch('/api/cadastrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                tipo: 'empresa',
                nomeEmpresa: document.querySelector('#nomeEmpresa').value,
                cnpj: document.querySelector('#cnpj').value,
                emailEmpresa: document.querySelector('#emailEmpresa').value,
                senha: document.querySelector('#senhaEmpresa').value,
            }),
        });

        const data = await response.json();
        if (data.success) {
            alert('Empresa cadastrada com sucesso!');
            window.location.href = '/login';
        } else {
            alert('Erro ao cadastrar empresa: ' + data.message);
        }
    } catch (error) {
        console.error('Erro no cadastro:', error);
        alert('Erro ao cadastrar empresa!');
    }
});
