
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

nome.addEventListener('keyup', () => {
    if (nome.value.length <= 2) {
      nome.setAttribute('style', 'color: red');
      validNome = false;
      msgError.innerHTML = 'Nome *Insira no mínimo 3 caracteres';
      msgError.style.display = 'block';
    }else {
      nome.setAttribute('style', 'color: green');
      validNome = true;
      msgError.style.display = 'none';
    }
});

nomedeusuario.addEventListener('keyup', () => {
    if (nomedeusuario.value.length <= 4) {
        nomedeusuario.setAttribute('style', 'border-color: red');
        validNomedeusuario = false;
        msgError.innerHTML = 'Usuário *Insira no mínimo 5 caracteres';
        msgError.style.display = 'block';
    } else {
        nomedeusuario.setAttribute('style', 'border-color: green');
        validNomedeusuario = true;
        msgError.style.display = 'none';
    }
});

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


let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
let cadastroForm = document.querySelector('#cadastroForm');
    
    cadastroForm.addEventListener('submit', function(event) {
      event.preventDefault(); 

      
    if (validNome && validNomedeusuario  && validEmail && validSenha) {

        listaUser.push({
            nomeCad: nome.value,
            userCad: nomedeusuario.value,
            emailCad: email.values,
            senhaCad: senha.value
        });

        localStorage.setItem('listaUser', JSON.stringify(listaUser));

        msgSuccess.setAttribute('style', 'display: block');
        msgSuccess.innerHTML = '<strong>Cadastrando usuário...</strong>';
        msgError.style.display = 'none';

        setTimeout(() => {
            window.location.href = '/login/login.html';
        }, 3000);
    } else {
        msgError.setAttribute('style', 'display: block; color: red;');
        msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de cadastrar</strong>';
        msgSuccess.style.display = 'none';
    }
});

