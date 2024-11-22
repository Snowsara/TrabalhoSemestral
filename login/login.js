
document.addEventListener("DOMContentLoaded", function() {
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");
  const loginForm = document.querySelector('#loginForm');

  let validEmail = false
  let validSenha = false
  let msgError = document.querySelector('#msgError')
  let msgSuccess = document.querySelector('#msgSuccess')

  if(!loginForm){
    console.log("Formulário de login não encontrado!");
    return;
  }

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
      const usuario = listaUser.find(user => user.emailCad === email.value)
       
      if (usuario && usuario.senhaCad === senha.value){
        const loggedUser = {
          userCad: usuario.userCad,
          emailCad: email.value,
          senhaCad: senha.value,
          tipo: usuario.tipo
        }


        console.log("Usuário encontrado, armazenando no localStorage...");
        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        msgSuccess.setAttribute('style', 'display: block');
        msgSuccess.innerHTML = '<strong>Logando...</strong>';
        msgError.style.display = 'none';

        console.log("Aguardando 3 segundos para redirecionamento...");

        setTimeout(() => {
          console.log("Redirecionar para a página inicial...");
            window.location.href = '/inical/index.html';
        }, 3000);
    
      } else {
        msgError.setAttribute('style', 'display: block; color: red;');
        msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de longar</strong>';
        msgSuccess.style.display = 'none';
      }
    }
  })
});

