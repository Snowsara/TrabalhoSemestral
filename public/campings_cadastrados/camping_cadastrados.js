
// Função para carregar os campings da API
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

        // Gera o card para cada camping recebido da API
        campings.forEach(camping => {
            const campingItem = criarCardCamping(camping);
            campingList.appendChild(campingItem);
        });

    } catch (error) {
        console.error('Erro ao carregar os campings:', error);
        const campingList = document.getElementById('campingList');
        campingList.innerHTML = '<p>Erro ao carregar campings.</p>';
    }
}

function renderCampings() {
    const campings = JSON.parse(localStorage.getItem('campings')) || [];
    const campingListElement = document.getElementById('campingList');
    
    // Limpa a lista antes de renderizar
    campingListElement.innerHTML = ''; 

    campings.forEach(camping => {
        // Criação de um card (div) para o camping, similar ao que você usaria no Bootstrap ou no layout da página
        const card = document.createElement('div');
        card.className = 'col-md-4'; // Classes de estilo, como no Bootstrap

        // Monta o conteúdo do card
        card.innerHTML = `
            <div class="card camping-card">
                <div class="card-body">
                    <h5 class="card-title">${camping.nomeCamping}</h5>
                    <p class="card-text">${camping.descricao || 'Sem descrição disponível.'}</p>
                    <button class="btn btn-danger excluir" data-id="${camping.id}">Excluir</button>
                </div>
            </div>
        `;

        // Adiciona o evento de exclusão para o botão
        card.querySelector('.excluir').addEventListener('click', excluirCamping);

        // Adiciona o card à lista de campings
        campingListElement.appendChild(card);
    });
}


// Função para criar os cards dinamicamente
function criarCardCamping(camping) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.id = `camping-${camping.id}`; // Atribui um ID único para o card do camping

    // Criação do card com o nome e a imagem
    const card = `
        <div class="card camping-card">
            <div class="card-body">
                <h5 class="card-title">${camping.nomeCamping}</h5>
                <!-- Aqui vamos inserir a imagem adicional -->
                ${camping.images && camping.images.length > 0 ? `
                    <div class="image-container">
                        ${camping.images.map(imageUrl => `
                            <img src="http://localhost:3003${imageUrl}" alt="Imagem de ${camping.nomeCamping}" />
                        `).join('')}
                    </div>
                ` : ''}
                <p class="card-text">${camping.descricao || 'Sem descrição disponível.'}</p>
                <button class="btn btn-primary detalhes" onclick="mostrarDetalhesCamping(${JSON.stringify(camping).replace(/"/g, '&quot;')})">Mais detalhes</button>
                <button class="btn btn-danger excluir" onclick="excluirCamping(${camping.id})">Excluir</button>        
            </div>
        </div>
    `;

    col.innerHTML = card;

    return col;
}

// Função para excluir um camping
function excluirCamping(id) {
    fetch(`http://localhost:3003/campings/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Atualizar o localStorage com a lista de campings atualizada, se necessário
            localStorage.setItem('campings', JSON.stringify(data.campings || []));

            // Atualizar a UI para remover o camping excluído
            document.getElementById(`camping-${id}`).remove(); // Remove o card da interface
            alert(data.message);
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Erro ao excluir camping:', error);
        alert('Erro ao excluir camping.');
    });
}



function carregarCampingsNaTela() {
    const campings = JSON.parse(localStorage.getItem('campings')) || [];
    // Lógica para renderizar os campings na interface
    // Atualizar a DOM com a nova lista de campings
}


// Função para mostrar os detalhes de um camping
function mostrarDetalhesCamping(camping) {
    const modalTitle = document.getElementById('campingModalLabel');
    const modalBody = document.getElementById('campingModalBody');

    // Preenche o título e o corpo do modal com os detalhes do camping
    modalTitle.textContent = camping.nomeCamping;
    modalBody.innerHTML = `
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
        <p><strong>Animais de estimação:</strong> ${camping.animaisEstimacoes || 'Não informado'}</p>
        <p><strong>Praia:</strong> ${camping.praia || 'Não informado'}</p>
        <p><strong>Calendário de funcionamento:</strong> ${camping.calendarioFuncionamento || 'Não informado'}</p>
        <p><strong>Regras Internas:</strong> ${camping.regrasInternas || 'Não informado'}</p>
        <p><strong>Disponibilidade de Eletricidade:</strong> ${camping.eletricidade || 'Não informado'}</p>
        <p><strong>Acessibilidade para cadeirantes:</strong> ${camping.acessibilidade || 'Não informado'}</p>
        <p><strong>Disponibilidade de comunicação:</strong> ${camping.comunicacao || 'Não informado'}</p>
        <p><strong>Apoio para veículos de recreação (Trailers e motor homes):</strong> ${camping.veiculosRecreacao || 'Não informado'}</p>
        <p><strong>Trilhas ou caminhadas:</strong> ${camping.trilhas || 'Não informado'}</p>
        <p><strong>Site na Internet:</strong> ${camping.siteInternet || 'Não informado'}</p>
        <p><strong>Endereço de Rede Social:</strong> ${camping.redeSocial || 'Não informado'}</p>
    `;

    // Se o camping tiver imagens adicionais, mostrar no modal
    if (camping.images && camping.images.length > 0) {
        const imageGallery = document.createElement('div');
        imageGallery.classList.add('image-gallery');

        camping.images.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = `http://localhost:3003${imageUrl}`;
            img.alt = `Imagem de ${camping.nomeCamping}`;
            img.classList.add('modal-image');
            imageGallery.appendChild(img);
        });

        modalBody.appendChild(imageGallery);
    }

    // Exibe o modal
    const modal = new bootstrap.Modal(document.getElementById('campingModal'));
    modal.show();
}

// Função para salvar um camping
async function salvarCamping(event) {
    event.preventDefault(); // Impede o envio do formulário

    const nomeCamping = document.getElementById('nomeCamping').value;
    if (!nomeCamping) {
        alert('Nome do camping é obrigatório.');
        return;
    }

    const camping = { nomeCamping };

    try {
        const response = await fetch('http://localhost:3003/campings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(camping),
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar o camping');
        }

        const novoCamping = await response.json();
        alert('Camping cadastrado com sucesso!');
        carregarCampings(); // Atualiza a lista de campings após salvar

    } catch (error) {
        console.error('Erro ao salvar o camping:', error);
        alert('Erro ao salvar o camping');
    }
}


// Carrega a lista de campings ao carregar a página
window.onload = function() {
    carregarCampings(); // Carrega os campings do servidor e renderiza
};


