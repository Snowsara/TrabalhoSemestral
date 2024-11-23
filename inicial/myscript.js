
document.addEventListener("DOMContentLoaded", function() {
    // Obter elementos da página
    const usernameElement = document.getElementById("usernameElement");
    const sairBtn = document.getElementById("sairBtn");
    const menuCadastrarCamping = document.getElementById("menuCadastrarCamping");

    // Verificar se há um usuário logado no localStorage
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    // Função para atualizar a visibilidade do botão "Cadastrar Camping"
    const atualizarVisibilidadeMenu = () => {
        if (loggedUser) {
                      
            // Verificar se o usuário logado é empresa ou um usuário normal
            if (loggedUser.tipo === 'empresa') {
               if (usernameElement) usernameElement.textContent = loggedUser.nomeEmpresa;
               if (menuCadastrarCamping) menuCadastrarCamping.style.display = 'block';
            } else {
               if (usernameElement) usernameElement.textContent = loggedUser.userCad || 'Anônimo';
               if (menuCadastrarCamping) menuCadastrarCamping.style.display = 'none';
            }
        } else {
            // Caso não tenha usuário logado
           if (usernameElement) usernameElement.textContent = "Anônimo";
           if (menuCadastrarCamping) menuCadastrarCamping.style.display = 'none'; // Ocultar o menu como padrão
        }
    }

    // Chama a função para configurar a visibilidade corretamente ao carregar a página
    atualizarVisibilidadeMenu();

    // Botão de sair
    if (sairBtn){
        sairBtn.addEventListener("click", function() {
            localStorage.removeItem("loggedUser"); // Remove o usuário logado
            window.location.href = "/login/login.html"; // Redireciona para a página de login
        });
    }
   
});
