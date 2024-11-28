
document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');

    // Limpa a pré-visualização e prepara para novas imagens
    if (imageUpload && imagePreview) {
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

    // Envio do formulário
    const formCadastro = document.getElementById('formCadastro');

    if(formCadastro){
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
            const cnpj = formData.get('cnpj');
    
            if (!nomeCamping) {
                alert("O nome do camping é obrigatório.");
                return;
            }
    
            // Validação do CNPJ
            if (!validarCNPJ(cnpj)) {
                alert("Por favor, insira um CNPJ válido.");
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
                const response = await fetch('http://localhost:3003/campings', {
                    method: 'POST',
                    body: formData, // Não defina 'Content-Type' quando usar FormData
                });
    
                    // Verifique se a resposta está em JSON antes de tentar fazer response.json()
                const contentType = response.headers.get("content-type");
    
                 if (contentType && contentType.indexOf("application/json") !== -1) {
                    const data = await response.json();
                
    
    
                if (response.ok) {
                    document.getElementById("mensagemErro").innerText = data.message;
                    window.location.href = '/campings_cadastrados/';
                } else {
                    alert('Erro ao cadastrar o camping: ' + data.message);
                }
            } else {
                // A resposta não é um JSON, então tratamos como texto (ou outro formato)
                const textResponse = await response.text();
                console.log("Resposta do servidor (não é JSON):", textResponse);
                alert("Erro ao cadastrar o camping. Resposta do servidor não está no formato JSON.");
            }
            } catch (error) {
                console.error('Erro no cadastro:', error);
                alert('Erro ao cadastrar o camping. Tente novamente.');
            }
        });
    }

});

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

// Função de validação de CNPJ
function validarCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, ''); // Remove todos os caracteres que não são números

    if (cnpj.length !== 14) {
        return false;
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }

    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) {
        return false;
    }

    tamanho += 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }

    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) {
        return false;
    }

    return true;
}
