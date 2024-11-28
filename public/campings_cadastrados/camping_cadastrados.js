
let campings = [];
async function carregarCampings() {
    try {
      const response = await fetch('http://localhost:3003/campings');
      if (!response.ok) {
        throw new Error('Erro ao buscar campings.');
      }
  
      const campings = await response.json();
      const campingList = document.getElementById('campingList');
  
      campingList.innerHTML = ''; // Limpa a lista antes de adicionar novos campings
  
      if (campings.length === 0) {
        campingList.innerHTML = '<p>Nenhum camping cadastrado.</p>';
        return;
      }
  
      campings.forEach(camping => {
        const cardCamping = criarCardCamping(camping); // Criando o card para cada camping
        campingList.appendChild(cardCamping); // Adicionando o card à lista
      });
    } catch (error) {
      console.error('Erro ao carregar os campings:', error);
      const campingList = document.getElementById('campingList');
      campingList.innerHTML = '<p>Erro ao carregar os campings.</p>';
    }
  }
  



function renderCampings() {
    const campings = JSON.parse(localStorage.getItem('campings')) || [];
    const campingListElement = document.getElementById('campingList');
    
    if (!campingListElement) {
        console.error('Elemento de lista de campings não encontrado!');
        return;
    }
    
    campingListElement.innerHTML = ''; // Limpa a lista antes de renderizar
    
    if (campings.length === 0) {
        campingListElement.innerHTML = '<p>Nenhum camping cadastrado.</p>';
        return;
    }

    campings.forEach(camping => {
        const cardCamping = criarCardCamping(camping);
        campingListElement.appendChild(cardCamping);
    });
}


// Função para criar os cards dinamicamente
function criarCardCamping(camping) {
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.id = `camping-${camping.id}`; // Atribui um ID único para o card do camping

    const card = document.createElement('div');
    card.classList.add('card', 'camping-card');

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = camping.nomeCamping;

    cardBody.appendChild(title);

    // Adiciona as imagens, se existirem
    if (camping.imagens && camping.imagens.length > 0) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        camping.imagens.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = `http://localhost:3003${imageUrl}`;  // Corrija a URL conforme necessário
            img.alt = `Imagem de ${camping.nomeCamping}`;
            img.style.width = '150px';
            img.style.margin = '10px';
            img.style.border = '1px solid #ccc';
            img.style.borderRadius = '5px';
            imageContainer.appendChild(img);
        });
        cardBody.appendChild(imageContainer);
    }

    const description = document.createElement('p');
    description.classList.add('card-text');
    description.textContent = camping.descricao || 'Sem descrição disponível.';

    cardBody.appendChild(description);

    const detalhesButton = document.createElement('button');
    detalhesButton.classList.add('btn', 'btn-primary');
    detalhesButton.textContent = 'Mais detalhes';
    detalhesButton.onclick = () => mostrarDetalhesCamping(camping);

    cardBody.appendChild(detalhesButton);

    const excluirButton = document.createElement('button');
    excluirButton.classList.add('btn', 'btn-danger');
    excluirButton.textContent = 'Excluir';
    excluirButton.onclick = () => excluirCamping(camping.id);

    cardBody.appendChild(excluirButton);

    card.appendChild(cardBody);
    col.appendChild(card);

    return col;
}



// Função para excluir um camping
function excluirCamping(id) {
    fetch(`http://localhost:3003/campings${id}`, {
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

async function salvarCamping(event) {
    event.preventDefault();
    const form = document.getElementById('formCadastro');
    const formData = new FormData(form); // Mantendo o uso de FormData, pois tem arquivos

    try {
        const response = await fetch('http://localhost:3003/campings', {
            method: 'POST',
            body: formData, // Envia o FormData diretamente
        });

        if (!response.ok) {
            throw new Error('Erro ao cadastrar o camping');
        }

        const result = await response.json();
        alert('Camping cadastrado com sucesso!');
        window.location.href = 'campings_cadastrados.html'; // Redireciona após salvar
    } catch (error) {
        console.error('Erro ao salvar o camping:', error);
        alert('Erro ao cadastrar camping.');
    }
}



localStorage.setItem('campings', JSON.stringify(campings));



// Carrega a lista de campings ao carregar a página
window.onload = function() {
    carregarCampings(); // Carrega os campings do servidor
    renderCampings();   // Renderiza os campings do localStorage
};



