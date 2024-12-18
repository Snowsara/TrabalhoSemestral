
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const cors = require("cors");
const bodyParser = require('body-parser');
const helmet = require('helmet'); // Adicione o Helmet para ajudar com o CSP
const port = 3003;
const connection = require('./db');
const session = require('express-session');

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Nome da imagem com timestamp
    }
});

// Filtro para garantir que apenas imagens sejam aceitas
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Aceita o arquivo se for uma imagem
    } else {
        cb(new Error('Tipo de arquivo não permitido. Por favor, envie uma imagem.'), false); // Rejeita o arquivo se não for uma imagem
    }
};

// Configura o multer com o filtro
const uploads = multer({ storage, fileFilter });

app.use(express.static('public'));

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
    res.sendFile(path.join(__dirname, "public", "cadastro_camping", "cadastrocamp.html"));
});

app.get("/campings_cadastrados", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "campings_cadastrados", "campings_cadastrados.html"));
});

//Endpoint para cadastro de camping
app.post('/api/cadastro_camping', uploads.single('ds_imagem'), async (req, res) => {
    const { nm_camping, nm_responsavel, nr_telefone, tp_acampamento,
            ob_animal, ob_eletrica, ob_trilha, nm_cidade, sg_estado, nr_cep, id_empresa } = req.body;

    // Verificar se a imagem foi enviada
    const ds_imagem = req.file ? req.file.filename : null;

    // Verificação dos campos obrigatórios
    if (!nm_camping || !nm_responsavel || !nr_telefone || !ds_imagem || !nm_cidade || !sg_estado || !nr_cep) {
        return res.status(400).send({ error: 'Campos obrigatórios não preenchidos.' });
    }

    try {
        // Inserir endereço no banco de dados
        const sqlEndereco = `
            INSERT INTO Tbl_CampLocalizacao (nm_cidade, sg_estado, nr_cep)
            VALUES (?, ?, ?);
        `;

        // Executar a query de inserção do endereço e obter o ID gerado
        const [resultEndereco] = await connection.promise().query(sqlEndereco, [nm_cidade, sg_estado, nr_cep]);
        const id_endereco = resultEndereco.insertId; // Obter o ID do endereço inserido

        // Inserir camping no banco de dados
        const sqlCamping = `
            INSERT INTO Tbl_Camping (nm_camping, nm_responsavel, nr_telefone, tp_acampamento,
                                     ob_animal, ob_eletrica, ob_trilha, ds_imagem, id_endereco, id_empresa) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;

        // Executar a query de inserção do camping
        await connection.promise().query(sqlCamping, [
            nm_camping, nm_responsavel, nr_telefone, tp_acampamento, 
            ob_animal, ob_eletrica, ob_trilha, ds_imagem, id_endereco, id_empresa
        ]);

        // Retornar sucesso
        res.json({ success: true, message: 'Camping cadastrado com sucesso!' });

    } catch (error) {
        console.error("Erro ao realizar cadastro", error);
        res.status(500).json({ success: false, message: "Erro ao realizar cadastro: " + error.message });
    }
});


// Endpoint para buscar os campings cadastrados
app.get('/api/campings_cadastrados', async (req, res) => {
    const sql = `SELECT * FROM Tbl_Camping`;

    try {
        // Usando a versão promise do mysql2
        const [result] = await connection.promise().query(sql);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: 'Erro ao buscar campings' });
    }
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


// Endpoint de cadastro
app.post('/api/cadastrar', async (req, res) => {
    const { nomec, nomedeusuario, email, senha, tipo, nomeEmpresa, cnpj, emailEmpresa, senhaEmpresa } = req.body;

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
            await connection.promise().query(sqlEmpresa, [nomeEmpresa, cnpj, emailEmpresa, senhaEmpresa]);

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

app.delete('/api/campings_cadastrados/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await connection.promise().query('DELETE FROM Tbl_Camping WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).send({ success: false, message: 'Camping não encontrado.' });
        }
        res.send({ success: true, message: 'Camping excluído com sucesso.' });
    } catch (err) {
        console.error('Erro ao excluir camping:', err);
        res.status(500).send({ success: false, message: 'Erro ao excluir o camping.' });
    }
});



// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
