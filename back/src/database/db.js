import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'senha',
  database: 'kronos'
});

console.log('Conectado ao banco');

export default connection;