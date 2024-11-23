const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware para servir arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Simulação de um "banco de dados" em memória
const campings = [];

// Configuração do multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath); // Cria a pasta "uploads" se não existir
        }
        cb(null, uploadPath); // Define o diretório de upload
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
        cb(null, uniqueName); // Nome único para cada arquivo
    }
});
const upload = multer({ storage: storage });

// Rota para cadastrar um camping
app.post('/cadastrar-camping', upload.array('images', 10), (req, res) => {
    const { nomeCamping } = req.body; // Obter os outros campos
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`); // URLs das imagens

    if (!nomeCamping) {
        return res.status(400).json({ message: 'O nome do camping é obrigatório.' });
    }

    // Salvar os dados do camping no "banco de dados"
    const novoCamping = {
        id: campings.length + 1,
        nomeCamping,
        images: imageUrls,
    };
    campings.push(novoCamping);

    res.status(200).json({ message: 'Camping cadastrado com sucesso!', camping: novoCamping });
});

// Rota para listar os campings cadastrados
app.get('/campings', (req, res) => {
    res.json(campings); // Retorna todos os campings cadastrados
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
