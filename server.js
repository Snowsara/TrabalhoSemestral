
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cors = require('cors');
const port = 3003;

let campigns = [];


const app = express();
app.use(express.json()); // Middleware para processar JSON
app.use(express.urlencoded({ extended: true })); // Middleware para processar dados de formulário
app.use(cors()); // permite requisições de qualquer origem


// Pasta para uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Caminho para o arquivo de dados
const campingsFilePath = path.join(__dirname, "campings.json");

// Função para ler os campings do arquivo JSON
function carregarCampings() {
    // Se o arquivo não existir, cria um novo arquivo vazio
    if (!fs.existsSync(campingsFilePath)) {
        fs.writeFileSync(campingsFilePath, JSON.stringify([]));  // Cria o arquivo com um array vazio
    }
    
    const data = fs.readFileSync(campingsFilePath, "utf8");
    return JSON.parse(data);
}

// Função para salvar os campings no arquivo JSON
function salvarCampings(campings) {
    fs.writeFileSync(campingsFilePath, JSON.stringify(campings, null, 2)); // Salva os campings no arquivo
}

// Configuração do multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por arquivo
});

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(uploadsDir)); // Servir arquivos enviados

// Rotas
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

// Rota para listar campings
app.get("/campings", (req, res) => {
    const campings = carregarCampings(); // Carrega os campings do arquivo JSON
    res.json(campings); // Retorna todos os campings cadastrados
});

// Rota para cadastrar camping
app.post("/cadastro_camping", upload.array("imagens", 10), (req, res) => {
    try {
        const { nomeCamping, nomeFantasia, cnpj, responsavel, email, telefone, endereco,
            areaAtuacao, coordenadasGPS, equipamentosAceitacao, equipamentos, animaisEstimacoes,
            praia, calendarioFuncionamento, regrasInternas, eletricidade, acessibilidade, comunicacao,
            veiculosRecreacao, trilhas, siteInternet, redeSocial } = req.body;

        // Validações
        if (!nomeCamping) {
            return res.status(400).json({ message: "O nome do camping é obrigatório." });
        }

        // Processa as imagens enviadas
        const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

        const campings = carregarCampings(); // Carrega os campings do arquivo JSON

        // Cria o objeto do camping
        const novoCamping = {
            id: campings.length + 1, // Definir um ID único
            nomeCamping,
            nomeFantasia: nomeFantasia || "Não informado",
            cnpj: cnpj || "Não informado",
            responsavel: responsavel,
            email: email,
            telefone: telefone,
            endereco: endereco,
            areaAtuacao: areaAtuacao,
            coordenadasGPS: coordenadasGPS,
            equipamentosAceitacao: equipamentosAceitacao,
            equipamentos: equipamentos,
            animaisEstimacoes: animaisEstimacoes,
            praia: praia,
            calendarioFuncionamento: calendarioFuncionamento,
            regrasInternas: regrasInternas,
            eletricidade: eletricidade,
            acessibilidade: acessibilidade,
            comunicacao: comunicacao,
            veiculosRecreacao: veiculosRecreacao,
            trilhas: trilhas,
            siteInternet: siteInternet,
            redeSocial: redeSocial,
            images: imageUrls,
        };

        // Adiciona o novo camping à lista
        campings.push(novoCamping);

        // Salva a lista de campings no arquivo JSON
        salvarCampings(campings);

        res.status(200).json({ message: "Camping cadastrado com sucesso!", camping: novoCamping });
    } catch (error) {
        console.error("Erro ao cadastrar camping:", error);
        res.status(500).json({
            message: "Erro interno ao tentar cadastrar o camping.",
        });
    }
});

// Rota para excluir camping
app.delete('/campings/:id', (req, res) => {
    const id = parseInt(req.params.id);

    // Carregar a lista de campings
    let campings = carregarCampings();

    // Verifica se o camping existe
    const index = campings.findIndex(camping => camping.id === id);

    if (index !== -1) {
        // Se o camping foi encontrado, remove ele da lista
        campings.splice(index, 1);

        // Salva os campings atualizados no arquivo
        salvarCampings(campings);

        // Envia a lista de campings atualizada
        res.status(200).json({ message: 'Camping excluído com sucesso', success: true, campings });
    } else {
        // Caso o camping não exista
        res.status(404).json({ message: 'Camping não encontrado', success: false });
    }
});


// Iniciar o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

