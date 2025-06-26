const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Função auxiliar para gerar um token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1h' // Define o token para expirar em 30 dias
  });
};

//Reigistra um novo usuário
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verifica se o usuário já existe
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário ou email já existe.' });
    } 

    // Cria um novo usuário usando o modelo
    const user = await User.create({
      username,
      email,
      password
    });

    // Se usuário criado com sucesso, gera um token JWT
    if (user) {
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id) // Gera o token JWT
      });
    } else {
      res.status(400).json({ message: 'Dados de usuário inválido.' });
    }
  } catch (error) {

    if (error.name === 'ValidationError') {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({ 
        message: 'Erro de validação', 
        errors: errors
      });
    }
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao registrar usuário.', error: error.message });
  }
};

//Controller login de usuário existente
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id) // Gera o token JWT
      });
    } else {
      res.status(401).json({ message: 'Email ou senha inválidos.' });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao fazer login.', error: error.message });
  }
};