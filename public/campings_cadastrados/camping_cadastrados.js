
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

    //Armazenar os campings no localStorage para possível uso offline
    localStorage.setItem('campings', JSON.stringify(campings));

    } catch (error) {
      console.error('Erro ao carregar os campings:', error);
      const campingList = document.getElementById('campingList');
      campingList.innerHTML = '<p>Erro ao carregar os campings.</p>';
    }
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
    title.textContent = camping.nm_camping;

    cardBody.appendChild(title);

    // Adiciona as imagens, se existirem
    if (camping.imagens && camping.imagens.length > 0) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        camping.imagens.forEach(imageUrl => {
            const img = document.createElement('img');
            img.src = `http://localhost:3003${imageUrl}`;  // Corrija a URL conforme necessário
            img.alt = `Imagem de ${camping.nm_camping}`;
            img.style.width = '150px';
            img.style.margin = '10px';
            img.style.border = '1px solid #ccc';
            img.style.borderRadius = '5px';
            imageContainer.appendChild(img);
        });
        cardBody.appendChild(imageContainer);
    }

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
    fetch(`http://localhost:3003/campings/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Atualizar o localStorage com a lista de campings atualizada, se necessário
            campings = campings.filter(camping => camping.id !== id);
            localStorage.setItem('campings', JSON.stringify(campings));

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


// Função para mostrar os detalhes de um camping
function mostrarDetalhesCamping(camping) {
    const modalTitle = document.getElementById('campingModalLabel');
    const modalBody = document.getElementById('campingModalBody');

    // Preenche o título e o corpo do modal com os detalhes do camping
    modalTitle.textContent = camping.nm_camping;
    modalBody.innerHTML = `
        <p><strong>Nome do Responsável:</strong> ${camping.nm_responsavel || 'Não informado'}</p>
        <p><strong>Email:</strong> ${camping.email || 'Não informado'}</p>
        <p><strong>Telefone:</strong> ${camping.nr_telefone || 'Não informado'}</p>
        <p><strong>Endereço:</strong> ${camping.endereco || 'Não informado'}</p>
        <p><strong>Tipo de acampamento:</strong> ${camping.tp_acampamento || 'Não informado'}</p>
        <p><strong>Tipo de habitação:</strong> ${camping.tp_habitacao || 'Não informado'}</p>
        <p><strong>Animais de estimação:</strong> ${camping.ob_animais || 'Não informado'}</p>
        <p><strong>Calendário de funcionamento:</strong> ${camping.calendarioFuncionamento || 'Não informado'}</p>
        <p><strong>Regras do camping:</strong> ${camping.ds_regras || 'Não informado'}</p>
        <p><strong>Disponibilidade de Eletricidade:</strong> ${camping.ob_eletrica || 'Não informado'}</p>
        <p><strong>Disponibilidade de comunicação:</strong> ${camping.comunicacao || 'Não informado'}</p>
        <p><strong>Trilhas:</strong> ${camping.ob_trilha || 'Não informado'}</p>
        <p><strong>Endereço de Rede Social:</strong> ${camping.redeSocial || 'Não informado'}</p>
    `;

    // Se o camping tiver imagens adicionais, mostrar no modal
    if (campings.images && campings.images.length > 0) {
        const imageGallery = document.createElement('div');
        imageGallery.classList.add('image-gallery');

        campings.images.forEach(imageUrl => {
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

// Carrega a lista de campings ao carregar a página
window.onload = function() {
    carregarCampings(); // Carrega os campings do servidor
};



