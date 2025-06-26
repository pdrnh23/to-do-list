/* 
Este arquivo é responsável por conectar ao banco de dados MongoDB usando Mongoose.
Ele utiliza a variável de ambiente MONGODB_URI para obter a URL de conexão.
*/

const mongoose = require('mongoose');
require('dotenv').config()

// Função assíncrona para conectar ao MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI); // Tenta conectar ao MongoDB usando a URL definida na variável de ambiente MONGODB_URI
    console.log('MongoDB conectado com sucesso'); //Log de sucesso
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message); // Caso ocorra um erro, exibe uma mensagem de erro no console
    process.exit(1);
  }
};

module.exports = connectDB; //Exporta função connectDB para ser usada em outros arquivos