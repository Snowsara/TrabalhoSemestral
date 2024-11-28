const multer = require('multer');
const path = require('path');

// Configuração do Multer para salvar as imagens na pasta "uploads"
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // A pasta onde as imagens serão armazenadas
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Nome único para cada imagem
    }
});

const uploads = multer({ storage: storage });

module.exports = uploads;
