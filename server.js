
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
const { error } = require('console');


const app = express();

// Middleware para processar dados JSON e formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configurar sessões
app.use(session({
    secret: 'segredo_super_secreto',
    resave: false,
    saveUninitialized: true
}));

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


// Endpoint para cadastrar camping
app.post('/cadastrar_camping', (req, res) => {
    const { nm_camping, nm_responsavel, nr_telefone, tp_acampamento, ob_animal,
        ob_eletrica} = req.body;
    
    const sql = `INSERT INTO Tbl_Camping (nm_camping, nm_responsavel, nr_telefone,
    tp_acampamento, ob_animal, ob_eletrica) VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [nm_camping, nm_responsavel, nr_telefone,
    tp_acampamento, ob_animal, ob_eletrica], (err, result ) => {
        if(err) {
            res.status(500).send({error: 'Erro ao cadastrar camping'});
        }else{
            res.status({ message: 'Camping cadastrado com sucesso!' });
        }
    });
});

app.get('/campings', (req, res) => {
    const sql = `SELECT * FROM Tbl_Camping`;

    db.query(sql, (err, result) => {
        if(err) {
            res.status(500).send({ error: 'Erro ao buscar campings'});
        }else {
            res.send(result);
        }
    });
});


// Rota de login
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ success: false, message: "Email e senha são obrigatórios!" });
    }

    // Consulta para verificar o usuário normal
    const queryUsuario = `SELECT id_usuario, nm_usuario FROM Tbl_CadUsuario WHERE ds_email = ? AND ds_senha = ?`;

    // Consulta para verificar a empresa
    const queryEmpresa = `SELECT id_empresa, nm_empresa FROM Tbl_CadEmpresa WHERE ds_emailempresa = ? AND ds_senhaempresa = ?`;

    // Verificar se é usuário normal
    connection.query(queryUsuario, [email, senha], (err, resultUsuario) => {
        if (err) throw err;

        if (resultUsuario.length > 0) {
            // Se for um usuário normal
            const nomedeusuario = resultUsuario[0].nm_usuario;
            req.session.nome = nomedeusuario;  // Salvar nome na sessão
            req.session.tipoCadastro = 'normal'; // Tipo de cadastro

            // Envia uma resposta JSON para o frontend
            return res.json({ success: true, nome: nomedeusuario, tipoCadastro: 'normal' });
        } else {
            // Verificar se é uma empresa
            connection.query(queryEmpresa, [email, senha], (err, resultEmpresa) => {
                if (err) throw err;

                if (resultEmpresa.length > 0) {
                    // Se for uma empresa
                    const nomeEmpresa = resultEmpresa[0].nm_empresa;
                    req.session.nome = nomeEmpresa;  // Salvar nome na sessão
                    req.session.tipoCadastro = 'empresa'; // Tipo de cadastro

                    // Envia uma resposta JSON para o frontend
                    return res.json({ success: true, nome: nomeEmpresa, tipoCadastro: 'empresa' });
                } else {
                    // Caso o login não seja de nenhum dos dois
                    return res.json({ success: false, message: 'Email ou senha incorretos!' });
                }
            });
        }
    });
});

app.get("/", (req, res) => {
    if (req.session.nome) {
      res.send(`Bem-vindo, ${req.session.nome}!`);
    } else {
      res.send('Você precisa fazer login primeiro.');
    }
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
