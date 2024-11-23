
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('imageUpload').addEventListener('change', function (event) {
        const imagePreview = document.getElementById('imagePreview');
        imagePreview.innerHTML = ""; // Limpa a pré-visualização anterior
    
        const files = event.target.files; // Obtém os arquivos selecionados
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
                    img.style.width = '150px'; // Define o tamanho da pré-visualização
                    img.style.margin = '10px';
                    img.style.border = '1px solid #ccc';
                    img.style.borderRadius = '5px';
                    imagePreview.appendChild(img);
                };
    
                reader.readAsDataURL(file); // Lê o arquivo como uma URL de dados
            } else {
                alert('Por favor, selecione apenas imagens.');
            }
        }
    });
    

    const formCadastro = document.getElementById('formCadastro');

    formCadastro.addEventListener('submit', function(event) {
    event.preventDefault(); 

    
    // Coleta os dados do formulário
    const nomeCamping = document.getElementById('nomeCamping').value.trim();
    const nomeFantasia = document.getElementById('nomeFantasia').value.trim();
    const cnpj = document.getElementById('cnpj').value.trim();
    const responsavel = document.getElementById('responsavel').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const areaAtuacao = document.getElementById('areaAtuacao').value.trim();
    const coordenadasGPS = document.getElementById('coordenadasGPS').value.trim();
    const equipamentosAceitacao = document.getElementById('equipamentosAceitacao').value.trim();
    const equipamentos = document.getElementById('equipamentos').value.trim();
    const animaisEstimacoes = document.getElementById('animaisEstimacoes').value.trim();
    const praia = document.getElementById('praia').value.trim();
    const calendarioFuncionamento = document.getElementById('calendarioFuncionamento').value.trim();
    const regrasInternas = document.getElementById('regrasInternas').value.trim();
    const eletricidade = document.getElementById('eletricidade').value.trim();
    const acessibilidade = document.getElementById('acessibilidade').value.trim();
    const comunicacao = document.getElementById('comunicacao').value.trim();
    const veiculosRecreacao = document.getElementById('veiculosRecreacao').value.trim();
    const trilhas = document.getElementById('trilhas').values.trim();
    const siteInternet = document.getElementById('siteInternet').value.trim();
    const redeSocial = document.getElementById('redeSocial').value.trim();
    const imageUpload = document.getElementById('imageUpload').files[0];  // Supondo que há um campo de imagem no formulário
    const rating = document.getElementById('rating').value;
    const comments = document.getElementById('comments').value;

      // Expressões regulares para validação
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;

      if (!nomeCamping) {
        alert("O nome do camping é obrigatório.");
        document.getElementById('nomeCamping').focus(); // Foca no campo inválido
        return; // Interrompe o processo
    }
    if (!emailRegex.test(email)) {
        alert("Por favor, insira um e-mail válido.");
        document.getElementById('email').focus(); // Foca no campo inválido
        return; // Interrompe o processo
    }
    if (!telefoneRegex.test(telefone)) {
        alert("Por favor, insira um telefone válido no formato (XX) XXXXX-XXXX.");
        document.getElementById('telefone').focus(); // Foca no campo inválido
        return; // Interrompe o processo
    }
    if (!endereco) {
        alert("O endereço é obrigatório.");
        document.getElementById('endereco').focus(); // Foca no campo inválido
        return; // Interrompe o processo
    }


    console.log({
        nomeCamping, nomeFantasia, cnpj, responsavel, email, telefone, endereco,
        areaAtuacao, coordenadasGPS, equipamentosAceitacao, equipamentos, animaisEstimacoes,
        praia, calendarioFuncionamento, regrasInternas, eletricidade, acessibilidade, comunicacao,
        veiculosRecreacao, trilhas, siteInternet, redeSocial, imageUpload
    });

    const formData = new FormData(this);

    /*try {
        const response = await fetch('/cadastrar-camping', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        alert(data.message);
    } catch (error) {
        console.error('Erro no cadastro:', error);
    }*/
        
        alert('Camping cadastrado com sucesso!');
          // Limpando o formulário após envio
        // Redireciona ou faz outra ação após o sucesso
        window.location.href = '/campings_cadastrados/campings_cadastrados.html';
        formCadastro.reset();
    })
});
