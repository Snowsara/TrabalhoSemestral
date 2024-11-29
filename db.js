const db = require('mysql2');

// Configuração de conexão com o banco de dados
const connection = db.createConnection({
  host: 'localhost', 
  port: 3306,
  user: 'root',
  password: '',  
  database: 'DB_CAMPING', 
});

// Conectar ao banco de dados
connection.connect((err) => {

  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com sucesso!');
});

module.exports = connection;


       