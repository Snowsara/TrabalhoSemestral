 
 // Função para carregar os campings
async function carregarCampings() {
    try {
        // Faz a requisição para obter os campings
        const response = await fetch('http://localhost:3003/campings'); // Corrige a URL
        if (!response.ok) {
            throw new Error('Erro ao buscar campings.');
        }

        const campings = await response.json();
        const campingList = document.getElementById('campingList');

        // Limpa a lista antes de adicionar novos elementos
        campingList.innerHTML = '';

        // Caso não haja campings cadastrados
        if (campings.length === 0) {
            campingList.innerHTML = '<p>Nenhum camping cadastrado.</p>';
            return;
        }

        // Gera o HTML para cada camping
        campings.forEach(camping => {
            const campingItem = document.createElement('div');
            campingItem.classList.add('camping-item');
            campingItem.innerHTML = `
                <h2>${camping.nomeCamping}</h2>
                <p><strong>Nome Fantasia:</strong> ${camping.nomeFantasia || 'Não informado'}</p>
                <p><strong>CNPJ:</strong> ${camping.cnpj || 'Não informado'}</p>
                <p><strong>Nome do Responsável:</strong> ${camping.responsavel || 'Não informado'}</p>
                <p><strong>Email:</strong> ${camping.email || 'Não informado'}</p>
                <p><strong>Telefone:</strong> ${camping.telefone || 'Não informado'}</p>
                <p><strong>Endereço:</strong> ${camping.endereco || 'Não informado'}</p>
                <p><strong>Área de Atuação:</strong> ${camping.areaAtuacao || 'Não informado'}</p>
                <p><strong>Coordenadas de GPS:</strong> ${camping.coordenadasGPS || 'Não informado'}</p>
                <p><strong>Equipamentos de aceitação:</strong> ${camping.equipamentosAceitacao || 'Não informado'}</p>
                <p><strong>Equipamentos:</strong> ${camping.equipamentos || 'Não informado'}</p>
                <p><strong>Animais de estimações:</strong> ${camping.animaisEstimacoes || 'Não informado'}</p>
                <p><strong>Praia:</strong> ${camping.praia || 'Não informado'}</p>
                <p><strong>Calendario de funcionamento:</strong> ${camping.calendarioFuncionamento || 'Não informado'}</p>
                <p><strong>Regras:</strong> ${camping.regrasInternas || 'Não informado'}</p>
                <p><strong>Disponibilidade de eletricidade:</strong> ${camping.eletricidade || 'Não informado'}</p>
                <p><strong>Acessibilidade para caderantes:</strong> ${camping.acessibilidade || 'Não informado'}</p>
                <p><strong>Disponibilidade de comunicação:</strong> ${camping.comunicacao || 'Não informado'}</p>
                <p><strong>Apoio para veículos de recreação (Trailers e motor homes)</strong> ${camping.veiculosRecreacao || 'Não informado'}</p>
                <p><strong>Trilhas ou caminhadas</strong> ${camping.trilhas || 'Não informado'}</p>
                <p><strong>Site na Internet</strong> ${camping.siteInternet || 'Não informado'}</p>
                <p><strong>Endereço de Rede Social</strong> ${camping.redeSocial || 'Não informado'}</p>
            `;

            // Adiciona imagens do camping, se houver
            if (camping.images && camping.images.length > 0) {
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');

                camping.images.forEach(imageUrl => {
                    const img = document.createElement('img');
                    img.src = `http://localhost:3003${imageUrl}`; // Corrige o caminho da imagem
                    img.alt = `Imagem de ${camping.nomeCamping}`;
                    img.style.width = '150px';
                    img.style.margin = '10px';
                    img.style.border = '1px solid #ccc';
                    img.style.borderRadius = '5px';
                    imageContainer.appendChild(img);
                });

                campingItem.appendChild(imageContainer);
            }

            // Adiciona o elemento ao container da lista
            campingList.appendChild(campingItem);
        });
    } catch (error) {
        console.error('Erro ao carregar os campings:', error);
        const campingList = document.getElementById('campingList');
        campingList.innerHTML = '';
    }
}

// Carrega a lista de campings ao carregar a página
window.onload = carregarCampings;
