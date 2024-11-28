const express = require('express');
const uploads = require('../middlewares/uploads'); // Importa a configuração do Multer

const router = express.Router();

// Rota para upload de imagem do camping
router.post('/uploadImagem', uploads.single('imagem'), (req, res) => {
  // Verifica se o arquivo foi enviado
  if (!req.file) {
    return res.status(400).send('Nenhuma imagem foi enviada');
  }

  // Salva no banco de dados ou processa conforme necessário
  const imagemUrl = '/uploads/' + req.file.filename; // Caminho da imagem no servidor

  // Aqui você pode fazer outras operações, como salvar no banco, etc.
  res.send({
    mensagem: 'Imagem carregada com sucesso!',
    imagemUrl: imagemUrl
  });
});

// Exemplo de rota para listar campings
router.get('/listCampings', (req, res) => {
  db.query('SELECT * FROM T_CAMPINGS', (err, results) => {
    if (err) {
      return res.status(500).send('Erro ao buscar campings');
    }
    res.send(results);
  });
});

// Rota para excluir camping (somente para empresas)
router.delete('/excluirCamping/:id', (req, res) => {
  const idCamping = req.params.id;
  
  // Aqui você deve verificar se o usuário é realmente a empresa dona
  db.query('DELETE FROM T_CAMPINGS WHERE id = ?', [idCamping], (err, result) => {
    if (err) {
      return res.status(500).send('Erro ao excluir camping');
    }
    res.send('Camping excluído com sucesso');
  });
});


module.exports = router;


