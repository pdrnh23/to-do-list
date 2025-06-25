const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, //Remove espaços em branco
  },
  description: {
    type: String,
    trim: true,
    default: '', //Valor padrão vazio
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now //Data de criação padrão
  }
});

module.exports = mongoose.model('Todo', todoSchema);