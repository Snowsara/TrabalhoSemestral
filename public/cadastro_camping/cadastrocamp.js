
document.getElementById('formCadastro').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    const nm_camping = document.getElementById('nm_camping').value;
    const nm_responsavel = document.getElementById('nm_responsavel').value;
    const nr_telefone = document.getElementById('nr_telefone').value;
    const tp_acampamento = document.getElementById('tp_acampamento').value;
    const ob_animal = document.getElementById('ob_animal').value;
    const ob_eletrica = document.getElementById('ob_eletrica').value;
    const ob_trilha = document.getElementById('ob_trilha').value;
    const ds_imagem = document.getElementById('ds_imagem').files[0]; // Captura a imagem selecionada

    //Captura os dados do endereço
    const nm_cidade = document.getElementById('nm_cidade').value;
    const sg_estado = document.getElementById('sg_estado').value;
    const nr_cep = document.getElementById('nr_cep');

    // Verifica se uma imagem foi selecionada
    if (!ds_imagem) {
        alert('Por favor, selecione uma imagem.');
        return;
    }

    // Validação do nome do camping
    if (!nm_camping) {
        alert("O nome do camping é obrigatório.");
        return;
    }

    // Validação do número de telefone (caso o formato seja fixo como o exemplo)
    const nr_telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    if (!nr_telefoneRegex.test(nr_telefone)) {
        alert("Por favor, insira um telefone válido.");
        return;
    }
    
    if (!nm_cidade || !sg_estado || !nr_cep ) {
        alert("Por favor, preencha todos os campos de endereço.");
        return;
    }

    // Cria um objeto FormData para enviar os dados
    const formData = new FormData();
    formData.append('nm_camping', nm_camping);
    formData.append('nm_responsavel', nm_responsavel);
    formData.append('nr_telefone', nr_telefone);
    formData.append('tp_acampamento', tp_acampamento);
    formData.append('ob_animal', ob_animal);
    formData.append('ob_eletrica', ob_eletrica);
    formData.append('ob_trilha', ob_trilha);
    formData.append('ds_imagem', ds_imagem);
    formData.append('nm_cidade', nm_cidade);
    formData.append('sg_estado', sg_estado);
    formData.append('nr_cep', nr_cep);

    // Envia os dados via POST para o backend
    try {
        const response = await fetch('http://localhost:3003/cadastro_camping', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();

        if (data.success) {
            alert('Camping cadastrado com sucesso!');
            // Redireciona para a página de campings cadastrados
            window.location.href = 'campings_cadastrados.html';
        } else {
            alert('Erro ao cadastrar camping: ' + data.message);
        }
    } catch (error) {
        console.error('Erro ao cadastrar o camping:', error);
        alert('Erro ao cadastrar o camping.');
    }
});
