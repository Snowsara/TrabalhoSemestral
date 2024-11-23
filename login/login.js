
document.addEventListener("DOMContentLoaded", function() {
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const loginForm = document.getElementById("loginForm");

  let validEmail = false
  let validSenha = false
  let msgError = document.querySelector('#msgError')
  let msgSuccess = document.querySelector('#msgSuccess')

  /*if(!loginForm){
    console.log("Formulário de login não encontrado!");
    return;
  }*/

  if(email){
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
  }

  if(senha){
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
  }

    
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

      
    if (validEmail && validSenha) {
      let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]')
      
      const usuario = listaUser.find(user => user.emailCad === email.value || user.emailEmpresa === email.value);

      if (usuario) {

        if ((usuario.senhaCad && usuario.senhaCad === senha.value) || (usuario.senhaEmpresa && usuario.senhaEmpresa === senha.value)){
          const loggedUser = {
            tipo: usuario.tipo,
            userCad: usuario.userCad || null,
            nomeEmpresa: usuario.nomeEmpresa || null,
            email: email.value,
            senha: senha.value
          }

          localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

          // Exibir mensagem de sucesso
          msgSuccess.setAttribute('style', 'display: block');
          msgSuccess.innerHTML = '<strong>Logando...</strong>';
          msgError.style.display = 'none';

          // Redirecionar após 3 segundos
          setTimeout(() => {
            window.location.href = '/inicial/index.html';
          }, 3600);

        } else {
          // Senha incorreta
          msgError.setAttribute('style', 'display: block; color: red;');
          msgError.innerHTML = '<strong>Email ou senha incorretos!</strong>';
          msgSuccess.style.display = 'none';
        }

      } else {
        // Caso o usuário não exista
        msgError.setAttribute('style', 'display: block; color: red;');
        msgError.innerHTML = '<strong>Email ou senha incorretos!</strong>';
        msgSuccess.style.display = 'none';
      }
    }
  });
});
