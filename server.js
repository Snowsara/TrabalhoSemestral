
const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json()); // Middleware para processar JSON
app.use(express.urlencoded({ extended: true })); // Middleware para processar dados de formulário

// Pasta para uploads
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
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

// Variável para armazenar campings cadastrados
let campings = []; // Inicializa a variável campings como um array

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

        // Cria o objeto do camping
        const novoCamping = {
            id: campings.length + 1,
            nomeCamping,
            nomeFantasia: nomeFantasia || "Não informado",
            cnpj: cnpj || "Não informado",
            resposavel: responsavel,
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

        // Adiciona o camping ao array
        campings.push(novoCamping);

        res.status(200).json({ message: "Camping cadastrado com sucesso!", camping: novoCamping });
    } catch (error) {
        console.error("Erro ao cadastrar camping:", error);
        res.status(500).json({
            message: "Erro interno ao tentar cadastrar o camping.",
        });
    }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

