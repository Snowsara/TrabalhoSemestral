
document.addEventListener("DOMContentLoaded", function() {
    // Obter elementos da página
    const usernameElement = document.getElementById("usernameElement");
    const sairBtn = document.getElementById("sairBtn");
    const menuCadastrarCamping = document.getElementById("menuCadastrarCamping");

    // Função para verificar se o usuário está logado
    const verificarUsuarioLogado = async () => {
        try {
            const response = await fetch('/api/verificar_usuario', {
                method: 'GET',
                credentials: 'include', // Usando cookies para verificar sessão
            });
            const data = await response.json();

            if (data.success && data.user) {
                // Atualizar nome de usuário e visibilidade do menu
                if (usernameElement) {
                    usernameElement.textContent = data.user.tipo === 'empresa' ? data.user.nomeEmpresa : data.user.userCad || 'Anônimo';
                }
                if (menuCadastrarCamping) {
                    menuCadastrarCamping.style.display = data.user.tipo === 'empresa' ? 'block' : 'none';
                }
            } else {
                // Caso o usuário não esteja logado
                if (usernameElement) usernameElement.textContent = "Anônimo";
                if (menuCadastrarCamping) menuCadastrarCamping.style.display = 'none';
            }
        } catch (error) {
            console.error('Erro ao verificar usuário', error);
        }
    };

    // Verificar o usuário ao carregar a página
    verificarUsuarioLogado();

    // Botão de sair
    if (sairBtn) {
        sairBtn.addEventListener("click", async function() {
            try {
                await fetch('/api/sair', { method: 'POST', credentials: 'include' });
                window.location.href = "../inicial/index.html"; // Redireciona para a página de login
            } catch (error) {
                console.error('Erro ao sair', error);
            }
        });
    }
});
