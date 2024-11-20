function mostrarCamposEspecificos() {
    const tipoCadastro = document.getElementById('tipoCadastro').value;
    const pessoaCampos = document.getElementById('pessoaCampos');
    const empresaCampos = document.getElementById('empresaCampos');

    if (tipoCadastro === 'pessoa') {
        pessoaCampos.classList.remove('hidden');
        empresaCampos.classList.add('hidden');
    } else {
        pessoaCampos.classList.add('hidden');
        empresaCampos.classList.remove('hidden');
    }
}

// Chama a função para garantir que os campos sejam exibidos corretamente ao carregar

document.addEventListener('DOMContentLoaded', function () {
    mostrarCamposEspecificos();

    const formCadastro = document.getElementById('formCadastro');

    formCadastro.addEventListener('submit', function(event) {
    event.preventDefault(); 
    
    // Coleta os dados do formulário
    const nomeCamping = document.getElementById('nomeCamping').value.trim();
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const comunicacao = document.getElementById('comunicacao').value;
    const recursosHidricos = document.getElementById('recursosHidricos').value;
    const sanitariosBasicos = document.getElementById('sanitariosBasicos').value;
    const alimentacao = document.getElementById('alimentacao').value;
    const veiculosRecreacao = document.getElementById('veiculosRecreacao').value;
    const trilhas = document.getElementById('trilhas').values;
    const siteInternet = document.getElementById('siteInternet').value;
    const redeSocial = document.getElementById('redeSocial').value;
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


    // Cria um FormData para enviar os dados, incluindo a imagem
    const formData = new FormData(formCadastro);
    formData.append('nomeCamping', nomeCamping);
    formData.append('nome', nome);
    formData.append('email', email);
    formData.append('telefone', telefone);
    formData.append('endereco', endereco);
    formData.append('comunicacao', comunicacao);
    formData.append('recursosHidricos', recursosHidricos);
    formData.append('sanitariosBasicos', sanitariosBasicos);
    formData.append('alimentacao', alimentacao);
    formData.append('veiculosRecreacao', veiculosRecreacao);
    formData.append('trilhas', trilhas);
    formData.append('siteInternet', siteInternet);
    formData.append('redeSocial', redeSocial);
    formData.append('imageUpload', imageUpload);
    formData.append('rating', rating);
    formData.append('comments', comments);
    


    // Envia os dados para o backend (Node.js)
    fetch('http://localhost:3000/cadastrocamp', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert('Camping cadastrado com sucesso!');
          // Limpando o formulário após envio
        // Redireciona ou faz outra ação após o sucesso
        window.location.href = '/campings_cadastrados/campings_cadastrados.html';
        formCadastro.reset();

    })
    .catch(error => {
        console.error('Erro ao cadastrar o camping:', error);
    });
    

  

    })
});
