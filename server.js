
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const cors = require("cors");
const bodyParser = require('body-parser');
const helmet = require('helmet'); // Adicione o Helmet para ajudar com o CSP
const port = 3003;
const connection = require('./db');

const { getSystemErrorMap } = require('util');


const app = express();

// Middleware para processar dados JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


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




app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "inicial", "index.html"));
});

app.get("/cadastro", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cadastro", "cadastro.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login", "login.html"));
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
app.post('/api/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: "Email e senha são obrigatórios!" });
    }

    // Consultar o banco de dados para verificar as credenciais
    const query = 'SELECT * FROM Tbl_CadUsuario WHERE ds_email = ? AND ds_senha = ?';

    connection.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error('Erro ao realizar a consulta no banco de dados:', err);
            return res.status(500).json({ success: false, message: "Erro ao processar o login." });
        }

        if (results.length > 0) {
            // Credenciais válidas
            res.json({ success: true, message: "Login bem-sucedido!", user: results[0] });
        } else {
            // Credenciais inválidas
            res.status(401).json({ success: false, message: "Email ou senha inválidos!" });
        }
        
        
    });
});

// Endpoint para obter dados do usuário ou da empresa
app.post('/api/obterDadosUsuario', (req, res) => {
    const { usuarioLogado, tipoCadastro } = req.body;

    if (!usuarioLogado || !tipoCadastro) {
        return res.status(400).json({ success: false, message: 'Dados insuficientes para buscar informações.' });
    }

    let query = '';
    let params = [];

    if (tipoCadastro === 'normal') {
        // Consulta para obter dados do usuário normal
        query = 'SELECT * FROM Tbl_CadUsuario WHERE nm_usuario = ?';
        params = [usuarioLogado];
    } else if (tipoCadastro === 'empresa') {
        // Consulta para obter dados da empresa
        query = 'SELECT * FROM Tbl_CadEmpresa WHERE nm_empresa = ?';
        params = [usuarioLogado];
    } else {
        return res.status(400).json({ success: false, message: 'Tipo de cadastro inválido.' });
    }

    // Realiza a consulta no banco de dados
    connection.query(query, params, (err, results) => {
        if (err) {
            console.error('Erro ao consultar o banco de dados:', err);
            return res.status(500).json({ success: false, message: 'Erro ao buscar os dados.' });
        }

        if (results.length > 0) {
            // Retorna os dados encontrados
            res.json({ success: true, usuario: results[0] });
        } else {
            res.status(404).json({ success: false, message: 'Usuário ou empresa não encontrados.' });
        }
    });
});



// Endpoint de cadastro
app.post('/api/cadastrar', async (req, res) => {
    const { nomec, nomedeusuario, email, senha, tipo, nomeEmpresa, cnpj, emailEmpresa } = req.body;

    // Verifica se é um usuário e valida os campos obrigatórios
    if (tipo === 'usuario' && (!nomec || !nomedeusuario || !email || !senha)) {
        return res.status(400).json({ success: false, message: 'Nome, usuário, email e senha são obrigatórios para o cadastro de usuário!' });
    }

    try {
        // Inserção para usuários normais (pessoa física)
        if (tipo === 'usuario') {
            const sqlUsuario = `
                INSERT INTO Tbl_CadUsuario (
                    nm_completouser,
                    nm_usuario,
                    ds_email,
                    ds_senha
                ) VALUES (?,?,?,?);
            `;

            // Executa a query para inserir o usuário no banco de dados
            await connection.promise().query(sqlUsuario, [nomec, nomedeusuario, email, senha]);

            // Retorna a resposta de sucesso com o novo usuário cadastrado
            res.json({ success: true, message: 'Cadastro realizado com sucesso!' });
        }

        // Inserção para empresas (caso o tipo seja 'empresa')
        if (tipo === 'empresa') {
            if (!nomeEmpresa || !cnpj || !emailEmpresa) {
                return res.status(400).json({ success: false, message: 'Nome da empresa, CNPJ e email da empresa são obrigatórios!' });
            }

            const sqlEmpresa = `
                INSERT INTO Tbl_CadEmpresa (
                    nm_empresa,
                    nr_cnpj,
                    ds_emailempresa,
                    ds_senhaempresa
                ) VALUES (?,?,?,?);
            `;

            // Executa a query para inserir a empresa no banco de dados
            await connection.promise().query(sqlEmpresa, [nomeEmpresa, emailEmpresa, senha, cnpj]);

            // Retorna a resposta de sucesso com a empresa cadastrada
            res.json({ success: true, message: 'Cadastro de empresa realizado com sucesso!' });
        }

    } catch (error) {
        console.error("Erro ao realizar cadastro", error);
        res.status(500).json({ success: false, message: "Erro ao realizar cadastro: " + error.message });
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
