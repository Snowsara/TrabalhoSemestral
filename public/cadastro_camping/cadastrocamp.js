
document.addEventListener('DOMContentLoaded', function () {
    const imageUpload = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('imagePreview');

    // Limpa a pré-visualização e prepara para novas imagens
    imageUpload.addEventListener('change', function (event) {
        imagePreview.innerHTML = ""; // Limpa a pré-visualização anterior

        const files = event.target.files; // Obtém os arquivos selecionados
        const fileSet = new Set(); // Usar um Set para garantir que as imagens não se repitam

        // Loop para cada arquivo selecionado
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Verifica se o arquivo é uma imagem e se ainda não foi adicionado
            if (file.type.startsWith('image/') && !fileSet.has(file.name)) {
                fileSet.add(file.name); // Adiciona o nome do arquivo ao Set para evitar duplicação

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

    // Envio do formulário
    const formCadastro = document.getElementById('formCadastro');
    formCadastro.addEventListener('submit', async function (event) {
        event.preventDefault();  // Impede o envio do formulário padrão

        const formData = new FormData(this);

        // Validação dos campos obrigatórios
        const nomeCamping = formData.get('nomeCamping').trim();
        const email = formData.get('email').trim();
        const telefone = formData.get('telefone').trim();
        const endereco = formData.get('endereco').trim();

        // Validação de campos obrigatórios
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
});


