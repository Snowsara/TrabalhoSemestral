
document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');

    // Limpa a pré-visualização e prepara para novas imagens
    if (imageUpload && imagePreview){

        imageUpload.addEventListener('change', function (event) {
            imagePreview.innerHTML = ""; // Limpa a pré-visualização anterior
    
            const files = event.target.files; // Obtém os arquivos selecionados
    
            // Loop para cada arquivo selecionado
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
    
                // Verifica se o arquivo é uma imagem
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
    
                    reader.onload = function (e) {
                        // Cria uma tag <img> para cada imagem
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = `Imagem ${i + 1}`;
                        img.style.width = '150px';
                        img.style.margin = '10px';
                        img.style.border = '1px solid #ccc';
                        img.style.borderRadius = '5px';
                        imagePreview.appendChild(img);
                    };
    
                    reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
                }
            }
        });
    } 

    // Exibir o camping cadastrado automaticamente após o cadastro bem-sucedido
    function addCampingToList(camping) {
        const campingList = document.getElementById('campingList');
        
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.style.width = '20%';

        card.innerHTML = `
            <img class="card-img-top" src="${camping.imagem}" alt="${camping.nomeCamping}">
            <div class="card-body">
                <h4 class="card-title">${camping.nomeCamping}</h4>
                <p class="card-text">${camping.descricao}</p>
                <p class="card-text"><small class="text-muted">${camping.endereco}</small></p>
            </div>
        `;

        campingList.appendChild(card);
    }

    // Envio do formulário
    document.addEventListener('DOMContentLoaded', function () {

        const formCadastro = document.getElementById('formCadastro');
       
        formCadastro.addEventListener('submit', async function (event) {
            event.preventDefault(); // Impede o envio do formulário padrão
    
            const formData = new FormData();
            const files = document.getElementById("imageUpload").files;
    
            // Adiciona cada arquivo ao FormData
            for (let i = 0; i < files.length; i++) {
                formData.append("imagens", files[i]); // Certifique-se de que o `name` seja "imagens"
            }
    
            // Adiciona outros campos do formulário ao FormData
            const inputs = formCadastro.querySelectorAll("input, select, textarea");
            inputs.forEach((input) => {
                if (input.type !== "file") {
                    formData.append(input.name, input.value);
                }
            });
    
            // Validação dos campos obrigatórios
            const nomeCamping = formData.get('nomeCamping');
            const email = formData.get('email');
            const telefone = formData.get('telefone');
            const endereco = formData.get('endereco');
    
            if (!nomeCamping) {
                alert("O nome do camping é obrigatório.");
                return;
            }
    
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                alert("Por favor, insira um e-mail válido.");
                return;
            }
    
            const telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
            if (!telefoneRegex.test(telefone)) {
                alert("Por favor, insira um telefone válido.");
                return;
            }
    
            if (!endereco) {
                alert("O endereço é obrigatório.");
                return;
            }
    
            // Envio para o backend
            try {
                const response = await fetch('/cadastro_camping', {
                    method: 'POST',
                    body: formData,
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    alert(data.message);
                    window.location.href = '/campings_cadastrados/';
                } else {
                    alert('Erro ao cadastrar o camping: ' + data.message);
                }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                alert('Erro ao cadastrar o camping. Tente novamente.');
            }
        });
    })
});
