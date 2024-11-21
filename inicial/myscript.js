document.addEventListener("DOMContentLoaded", function() {
    // Obter o elemento que exibirá o nome do usuário
    const usernameElement = document.getElementById("usernameElement");

    // Verificar se o nome de usuário está no localStorage
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    // Se houver um usuário logado, exiba o nome completo
    if (loggedUser && loggedUser.userCad) {
        usernameElement.textContent = loggedUser.userCad;
    } else {
        usernameElement.textContent = "Anônimo"; // Caso não tenha usuário logado
    }

    // Botão de sair
    const sairBtn = document.getElementById("sairBtn");
    sairBtn.addEventListener("click", function() {
        localStorage.removeItem("loggedUser"); // Remove o usuário logado
        window.location.href = "/inicial/index.html"; // Redireciona para a página de login
    });

});





/*const userLogado = JSON.parse(localStorage.getItem("userLogado"));
  
const logado = document.querySelector("#logado");
logado.innerHTML = `Olá ${userLogado.nome}`;
  
function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("userLogado");
    window.location.href = "/login/login.html";
}*/
