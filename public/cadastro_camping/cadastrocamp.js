
document.getElementById('formCadastro').addEventListener('submit', async function (event) {
    event.preventDefault(); // Impede o envio do formulário padrão
    
    const campingData ={
        nm_camping: document.getElementById('nm_camping').value,
        nm_responsavel: document.getElementById('nm_responsavel').value,
        nr_telefone: document.getElementById('nr_telefone').value,
        tp_acampamento: document.getElementById('tp_acampamento').value,
        ob_animal: document.getElementById('ob_animal').value,
        ob_eletrica: document.getElementById('ob_eletrica').value,
        email: document.getElementById('email').value,
        endereco: document.getElementById('endereco').value,
        tp_habitacao: document.getElementById('tp_habitacao').value,
        ds_regras: document.getElementById('ds_regras').value,
        ob_trilha: document.getElementById('ob_trilha').value,
        redeSocial: document.getElementById('redeSocial').value
    };

    if (!campingData.nm_camping) {
        alert("O nome do camping é obrigatório.");
        return;
    };

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(campingData.email)) {
        alert("Por favor, insira um e-mail válido.");
        return;
    };

    const nr_telefoneRegex = /^\(\d{2}\)\s\d{5}-\d{4}$/;
    if (!nr_telefoneRegex.test(campingData.nr_telefone)) {
        alert("Por favor, insira um telefone válido.");
        return;
    };

    if (!campingData.endereco) {
        alert("O endereço é obrigatório.");
        return;
    };

    try{
        const response = await fetch('/campings_cadastrados', {
            method: 'POST',
            headers: { 
                'Content-Type': 'applicatiob/json'
            },
            body: JSON.stringify(campingData)
        });

        if (!response.ok){
            throw new Error('Erro ao cadastrar o camping');
        }

        const result = await response.json();
        alert('Camping cadastrado com sucesso!');
        window.location.href = '/campings_cadastrados';
    } catch (error) {
        console.error('Erro ao salvar o camping:', error);
        alert('Erro ao cadastrar camping.');
    }
});

