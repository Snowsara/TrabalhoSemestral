const mysql = require('mysql2');

// Configuração de conexão com o banco de dados
const db = mysql.createConnection({
  host: 'localhost: 3306',      // O endereço do servidor MySQL (pode ser um IP ou domínio)
  user: 'root',           // Seu usuário no MySQL
  password: 'sua_senha',  // Sua senha do MySQL
  database: 'DB_CAMPING', // O nome do seu banco de dados
});

// Conectar ao banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com sucesso!');
});

db.end();


       