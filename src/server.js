const app = require('./app');
const connectDB = require('./config/db'); 
require('dotenv').config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try { 
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar o servidor:', error.message);
    process.exit(1);
  }
};

startServer();