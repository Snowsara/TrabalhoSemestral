 // Função para exibir os campings cadastrados
function carregarCampings() {
    const campings = JSON.parse(localStorage.getItem('campings')) || [];
    const campingList = document.getElementById('campingList');

    document.addEventListener('DOMContentLoaded', () => {
        // Fazer uma requisição para obter os campings cadastrados
        fetch('http://localhost:3000/getCampings')
            .then(response => response.json())
            .then(campings => {
                const campingsList = document.getElementById('campingsList');
                // Exibe os campings na lista
                campings.forEach(camping => {
                    const campingItem = document.createElement('li');
                    campingItem.textContent = camping.nomeCamping;  // Ajuste conforme necessário
                    campingsList.appendChild(campingItem);
                });
            })
            .catch(error => console.error('Erro ao carregar os campings:', error));
    });

    // Verifica se há campings cadastrados
    if (campings.length === 0) {
        campingList.innerHTML = '<p>Nenhum camping cadastrado.</p>';
        return;
    }

    // Gera HTML para cada camping
    campings.forEach((camping, index) => {
        const campingItem = document.createElement('div');
        campingItem.classList.add('camping-item');
        campingItem.innerHTML = `
            <p><strong>Nome do Camping:</strong> ${camping.nomeCamping}</p>
            <p><strong>Nome Fantasia:</strong> ${camping.nome}</p>
            <p><strong>Email:</strong> ${camping.email}</p>
            <p><strong>Telefone:</strong> ${camping.telefone}</p>
            <p><strong>CPF:</strong> ${camping.cpf}</p>
            <p><strong>Endereço:</strong> ${camping.endereco}</p>
            <p><strong>Recursos Hídricos</strong> ${camping.recursosHidricos}</p>
            <p><strong>Banheiros</strong> ${camping.sanitariosBasicos}</p>
            <p><strong>Alimentação</strong> ${camping.alimentacao}</p>
            <p><strong>Apoio para veículos de recreação (Trailers e motor homes)</strong> ${camping.veiculosRecreacao}</p>
            <p><strong>Trilhas ou caminhadas</strong> ${camping.trilhas}</p>
            <p><strong>Site na Internet</strong> ${camping.siteInternet}</p>
            <p><strong>Endereço de Rede Social</strong> ${camping.redeSocial}</p>
            <p><strong>Classificação (1 a 5)</strong> ${camping.rating}</p>
            <p><strong>Comentário</strong> ${camping.comments}</p>
        `;

        // Exibe as imagens do camping
        if (camping.images && camping.images.length > 0) {
            const imageContainer = document.createElement('div');
            camping.images.forEach(imageUrl => {
                const img = document.createElement('img');
                img.src = imageUrl;
                img.alt = `Imagem de ${camping.nomeCamping}`;
                img.style.width = '150px';
                img.style.margin = '10px';
                imageContainer.appendChild(img);
            });
            campingItem.appendChild(imageContainer);
        }

        campingList.appendChild(campingItem);
    });
}

// Carrega a lista de campings ao carregar a página
window.onload = carregarCampings;
