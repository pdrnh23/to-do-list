const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
require('dotend').config();

//Midleware proteção de rotas
const protect = async(req, res, next) => {
  let token;

  //Verifica se vai começar com "Bearer"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      //Verifica usando a chave
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Acha usuário pelo id decodificado
      req.user = await User.findById(decoded.id).select('-password');

      //Se usuário não encontrado, retorna erro
      if (!req.user) {
        return res.status(401).json({ message: 'Não autorizado, token falhou (usuário não encontrado).' });
      }

      next();
    } catch (error) {
      console.error('Erro na validação do token:', error);
            res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }

  //Sem token fornecido
  if (!token) {
    res.status(401).json({ message: 'Não autorizado, nenhum token.' });
  }
};

module.exports = { protect };