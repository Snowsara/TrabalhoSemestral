
document.addEventListener("DOMContentLoaded", function() {
  const email = document.getElementById("email");
  const senha = document.getElementById("senha");

  let validEmail = false
  let validSenha = false
  let msgError = document.querySelector('#msgError')
  let msgSuccess = document.querySelector('#msgSuccess')

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


  let listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]');
  let loginForm = document.querySelector('#loginForm');
    
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

      
    if (validEmail && validSenha) {
      const listaUser = JSON.parse(localStorage.getItem('listaUser') || '[]')
      const usuario = listaUser.find(user => user.emailCad === email.value)
       
      if (usuario && usuario.senhaCad === senha.value){
        const loggedUser = {
          userCad: usuario.userCad,
          emailCad: email.value,
          senhaCad: senha.value
        }



        localStorage.setItem('loggedUser', JSON.stringify(loggedUser));

        msgSuccess.setAttribute('style', 'display: block');
        msgSuccess.innerHTML = '<strong>Logando...</strong>';
        msgError.style.display = 'none';

        setTimeout(() => {
            window.location.href = '/inicial/index.html';
        }, 3000);
    
      } else {
        msgError.setAttribute('style', 'display: block; color: red;');
        msgError.innerHTML = '<strong>Preencha todos os campos corretamente antes de longar</strong>';
        msgSuccess.style.display = 'none';
      }
    }
  })
});

