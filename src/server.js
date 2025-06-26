const app = require('./app');
const connectDB = require('./config/db'); 

const PORT = process.env.PORT || 5000; // Variável de ambiente para a porta, padrão é 5000

const startServer = async () => {
  try { 
    await connectDB(); // Tenta conectar ao banco de dados MongoDB
    app.listen(PORT, () => { // Conexão bem sucedida, inicia o servidor na porta especificada servidor inicia o servidor Express na porta definida
      console.log(`Servidor rodando na porta ${PORT}`); // Log sucesso
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error.message); // Log erro
    process.exit(1);
  }
};

startServer();