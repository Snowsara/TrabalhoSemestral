document.getElementById('tipoCadastro').addEventListener('change', function() {
    limparMensagemDeErro();
    if (this.value === 'empresa') {
        document.getElementById('cadastroForm').style.display = 'none';
        document.getElementById('cadastroEmpresa').style.display = 'block';
    } else {
        document.getElementById('cadastroForm').style.display = 'block';
        document.getElementById('cadastroEmpresa').style.display = 'none';
    }
});


let nome = document.querySelector('#nome')
let validNome = false

let nomedeusuario = document.querySelector('#nomedeusuario')
let validNomedeusuario = false

let email = document.querySelector('#email')
let validEmail = false

let senha = document.querySelector('#senha')
let validSenha = false

let msgError = document.querySelector('#msgError')
let msgSuccess = document.querySelector('#msgSuccess')

const mostrarErro1 = (mensagem1) => {
    msgError.style.display = 'block';
    msgError.setAttribute('style', 'color: red;');
    msgError.innerHTML = `<strong>${mensagem1}</strong>`;
};

// Limpando mensagem de erro
const limparErro1 = () => {
    msgError.style.display = 'none';
    msgError.innerHTML = '';
};

nome.addEventListener('keyup', () => {
    if (nome.value.length <= 2) {
      nome.setAttribute('style', 'color: red');
      validNome = false;
      mostrarErro1 ('Nome *Insira no mínimo 3 caracteres');
    }else {
      nome.setAttribute('style', 'color: green');
      validNome = true;
      limparErro1();
    }
});

nomedeusuario.addEventListener('keyup', () => {
    if (nomedeusuario.value.length <= 4) {
        nomedeusuario.setAttribute('style', 'border-color: red');
        validNomedeusuario = false;
        mostrarErro1 ('Usuário *Insira no mínimo 5 caracteres');
    } else {
        nomedeusuario.setAttribute('style', 'border-color: green');
        validNomedeusuario = true;
        limparErro1();
    }
});

email.addEventListener('keyup', () => {
    if (email.value.length <= 4) {
        email.setAttribute('style', 'border-color: red');
        validEmail = false;
        mostrarErro1 ('Email *Insira no mínimo 6 caracteres');
    } else {
        email.setAttribute('style', 'border-color: green');
        validEmail = true;
        limparErro1();
    }
});

senha.addEventListener('keyup', () => {
    if (senha.value.length <= 5) {
        senha.setAttribute('style', 'border-color: red');
        validSenha = false;
        mostrarErro1 ('Senha *Insira no mínimo 6 caracteres');
    } else {
        senha.setAttribute('style', 'border-color: green');
        validSenha = true;
        limparErro1();
    }
});


let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
let cadastroForm = document.querySelector('#cadastroForm');
    
    cadastroForm.addEventListener('submit', function(event) {
      event.preventDefault(); 

      
    if (validNome && validNomedeusuario  && validEmail && validSenha) {

        listaUser.push({
            tipo: 'usuário',
            nomeCad: nome.value,
            userCad: nomedeusuario.value,
            emailCad: email.value,
            senhaCad: senha.value
        });

        localStorage.setItem('listaUser', JSON.stringify(listaUser));

        msgSuccess.setAttribute('style', 'display: block');
        msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>';
        msgError.style.display = 'none';

        setTimeout(() => {
            window.location.href = '/login/login.html';
        }, 3003);
    } else {
        msgError.setAttribute('style', 'display: block; color: red;');
        msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>';
        msgSuccess.style.display = 'none';
    }
});

let emailEmpresa = document.querySelector('#emailEmpresa')
let validEmailEmpresa = false

let senhaEmpresa = document.querySelector('#senhaEmpresa')
let validSenhaEmpresa = false

let cnpj = document.querySelector('#cnpj')
let validCNPJ = false

let nomeEmpresa = document.querySelector('#nomeEmpresa')

let msgError2 = document.querySelector('#msgError2')
let msgSuccess2 = document.querySelector('#msgSuccess2')


const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

function validarCNPJ(cnpj){
    cnpj = cnpj.replace(/[^\d]+/g, '')

    if(cnpj.length !== 14 || /^(\d)\1+$/.test(cnpj)) return false;
    
    let soma = 0;
    let pesos = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    for (let i = 0; i < 12; i++){
        soma += cnpj[i] * pesos[i];
    }
    let resto = soma % 11;
    let primeiroDigito = resto < 2 ? 0 : 11 - resto;

    if (primeiroDigito !== parseInt(cnpj[12])) return false;

    soma = 0;
    pesos = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    for (let i = 0; i < 13; i++){
        soma += cnpj[i] * pesos[i];
    }
    resto = soma % 11;
    let segundoDigito = resto < 2 ? 0 : 11 - resto;

    return segundoDigito === parseInt(cnpj[13]);
}

const mostrarErro = (mensagem) => {
    msgError2.style.display = 'block';
    msgError2.setAttribute('style', 'color: red;');
    msgError2.innerHTML = `<strong>${mensagem}</strong>`;
};

// Limpando mensagem de erro
const limparErro = () => {
    msgError2.style.display = 'none';
    msgError2.innerHTML = '';
};

emailEmpresa.addEventListener('keyup', () => {
    // Verifica se o email tem pelo menos 6 caracteres
    if (emailEmpresa.value.length <= 4) {
        emailEmpresa.setAttribute('style', 'border-color: red');
        validEmailEmpresa = false;
        mostrarErro ('Email *Insira no mínimo 5 caracteres');
    }else if (!emailRegex.test(emailEmpresa.value)) {
        emailEmpresa.setAttribute('style', 'border-color: red');
        validEmailEmpresa = false;
        mostrarErro ('Email *Formato inválido');
    }else {
        emailEmpresa.setAttribute('style', 'border-color: green');
        validEmailEmpresa = true;
        limparErro();
    }
});


senhaEmpresa.addEventListener('keyup', () => {
    if (senhaEmpresa.value.length <= 5) {
        senhaEmpresa.setAttribute('style', 'border-color: red');
        validSenhaEmpresa = false;
        mostrarErro ('Senha *Insira no mínimo 6 caracteres');
    } else {
        senhaEmpresa.setAttribute('style', 'border-color: green');
        validSenhaEmpresa = true;
        limparErro();
    }
});

cnpj.addEventListener('keyup', () => {
    if (!validarCNPJ(cnpj.value)){
        cnpj.setAttribute('style', 'border-color: red');
        validCNPJ = false;
        mostrarErro ('CNPJ inválido');
        return; //impedir o envio do cadastro se o CNPJ está errado
    }else{
        cnpj.setAttribute('style', 'border-color: green');
        validCNPJ = true;
        limparErro();
    }
})

let cadastroEmpresa = document.querySelector('#cadastroEmpresa');
    
    cadastroEmpresa.addEventListener('submit', function(event) {
      event.preventDefault(); 

      
    if (validEmailEmpresa && validSenhaEmpresa && validCNPJ) {

        let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
        listaUser.push({
        tipo: 'empresa',
        nomeEmpresa: nomeEmpresa.value,
        cnpj: cnpj.value,
        emailEmpresa: emailEmpresa.value,
        senhaEmpresa: senhaEmpresa.value
        });
        

        localStorage.setItem('listaUser', JSON.stringify(listaUser));

        msgSuccess2.setAttribute('style', 'display: block');
        msgSuccess2.innerHTML = '<strong>Cadastrando empresa..</strong>';
        msgError2.style.display = 'none';

        setTimeout(() => {
            window.location.href = '/login/login.html';
        }, 3003);
    } else {
        msgError2.setAttribute('style', 'display: block; color: red;');
        msgError2.innerHTML = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>';
        msgSuccess2.style.display = 'none';
    }
});

function limparMensagemDeErro(){
    msgError.style.display = 'none';
    msgError.innerHTML = '';
    msgError2.style.display = 'none';
    msgError2.innerHTML = '';
}

/*let opcaocadastroForm = document.querySelector('#opcaoForm');
let opcaocadastroEmpresa = document.querySelector('#opcaoEmpresa');

opcaocadastroForm.addEventListener('click', () => {
    limparMensagemDeErro();
    document.querySelector('#cadastroForm').style.display = 'block';
    document.querySelector('#cadastroEmpresa').style.display = 'none';
});

opcaocadastroEmpresa.addEventListener('click', () => {
    limparMensagemDeErro();
    document.querySelector('#cadastroEmpresa').style.display = 'block';
    document.querySelector('#cadastroForm').style.display = 'none';
});*/