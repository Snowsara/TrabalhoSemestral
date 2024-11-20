const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Permitir requisições de outros domínios (CORS)
app.use(cors());

// Middleware para ler JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rota de exemplo
app.post('/cadastrocamp', (req, res) => {
    console.log(req.body);
    res.send('Camping cadastrado com sucesso!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
