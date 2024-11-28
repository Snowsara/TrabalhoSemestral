
const express = require('express');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');
const fs = require("fs");
const cors = require("cors");
const bodyParser = require('body-parser');
const helmet = require('helmet'); // Adicione o Helmet para ajudar com o CSP
const port = 3003;
const db = require('../db_Camping');



const app = express();

// Middleware para processar dados JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


// Configuração do body-parser para processar dados do formulário
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Nome da imagem
    }
});



const uploads = multer({ storage: storage });
app.use(express.static(path.join(__dirname, 'public')));


//Rotas
app.use(express.static('public', {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.js')) {
            res.set('Content-Type', 'application/javascript');
        } else if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "inicial", "index.html"));
});

app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cadastro", "cadastro.html"));
});

app.get("/cadastro_camping", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cadastro_camping", "cadastro_camping.html"));
});

app.get("/campings_cadastrados", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "campings_cadastrados", "campings_cadastrados.html"));
});

app.get("/campings", (req, res) => {
    const campings = carregarCampings(); // Carrega os campings do arquivo JSON
    res.json(campings); // Retorna todos os campings cadastrados
});



// Endpoint para o upload de imagens e cadastro do camping
app.post('/campings/uploadImagem', uploads.array('imagens', 5), async (req, res) => {
    try {
        // Obtém os caminhos das imagens enviadas
        const imagens = req.files.map(file => `/uploads/${file.filename}`);

        // Dados do camping
        const { nomeCamping, nomeFantasia, cnpj, responsavel, email, telefone, endereco,
          areaAtuacao, coordenadasGPS, equipamentosAceitacao, equipamentos, animaisEstimacoes,
          praia, calendarioFuncionamento, regrasInternas, eletricidade, acessibilidade, comunicacao,
          veiculosRecreacao, trilhas, siteInternet, redeSocial } = req.body;

        // Insere os dados do camping no MariaDB
        const sql = `
        INSERT INTO T_CAMPINGS (nome, nome_fantasia, cnpj, responsavel, email, telefone, endereco, area_atuacao, 
        coordenadas_gps, equipamentos_aceitacao, equipamentos, animais_estimacoes, praia, 
        calendario_funcionamento, regras_internas, eletricidade, acessibilidade, comunicacao, 
        veiculos_recreacao, trilhas, site_internet, rede_social, imagens)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [result] = await pool.execute(sql, [
            nomeCamping,
            nomeFantasia,
            endereco,
            responsavel,
            cnpj,
            email,
            telefone,
            areaAtuacao, 
            coordenadasGPS, 
            equipamentosAceitacao, 
            equipamentos, 
            animaisEstimacoes,
            praia, 
            calendarioFuncionamento, 
            regrasInternas, 
            eletricidade, 
            acessibilidade, 
            comunicacao,
            veiculosRecreacao, 
            trilhas, 
            siteInternet, 
            redeSocial,
            imagens.join(',') // Armazena os caminhos das imagens como uma string separada por vírgulas
        ]);

        res.status(201).json({
            message: 'Camping cadastrado com sucesso!',
            id: result.insertId,
            imagens: imagens
        });
    } catch (error) {
        console.error('Erro ao cadastrar camping:', error);
        res.status(500).json({
            message: 'Erro ao cadastrar camping.',
            error: error.message
        });
    }
});

// Servir arquivos estáticos (as imagens, no caso)
app.use('/uploads', express.static('uploads'));

// Endpoint de login
app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;

    const user = await User.findOne({ where: { emailCad: email } });
    
    if (user) {
        const senhaValida = await bcrypt.compare(senha, user.senhaCad); // Verifica senha com bcrypt
        if (senhaValida) {
            req.session.user = { id: user.id, tipo: user.tipo, nomeEmpresa: user.nomeEmpresa };
            res.json({ success: true, user: { tipo: user.tipo, userCad: user.userCad, nomeEmpresa: user.nomeEmpresa } });
        } else {
            res.json({ success: false });
        }
    } else {
        res.json({ success: false });
    }
});

// Endpoint de cadastro
app.post('/api/cadastrar', async (req, res) => {
    const { tipo, nome, userCad, email, senha, nomeEmpresa, cnpj } = req.body;

    // Se for uma empresa, validamos o CNPJ
    if (tipo === 'empresa' && (!nomeEmpresa || !cnpj)) {
        return res.status(400).json({ success: false, message: 'Nome da empresa e CNPJ são obrigatórios!' });
    }

    // Criptografando a senha
    const hashedSenha = await bcrypt.hash(senha, 10);

    try {
        let newUser;
        
        // Criar novo usuário ou empresa
        if (tipo === 'empresa') {
            newUser = await User.create({
                nomeEmpresa: nomeEmpresa,
                emailEmpresa: emailEmpresa,
                senhaEmpresa: hashedSenha,
                cnpj,  // CNPJ da empresa
                tipo,  // 'empresa'
            });
        } else {
            newUser = await User.create({
                nomeCad: nome,
                userCad,
                emailCad: email,
                senhaCad: hashedSenha,
                tipo: 'usuário',  // Tipo de usuário padrão
            });
        }

        // Retorna a resposta de sucesso
        res.json({ success: true, user: newUser });
    } catch (error) {
        console.error('Erro ao cadastrar', error);
        res.status(500).json({ success: false, message: 'Erro interno no servidor!' });
    }
});

// Endpoint para verificar se o usuário está logado
app.get('/api/verificar_usuario', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false });
    }
});

// Endpoint para logout
app.post('/api/sair', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ success: false });
        }
        res.json({ success: true });
    });
});


// Inicializa o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

