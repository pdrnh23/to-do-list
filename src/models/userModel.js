const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { create } = require('./todoModels');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'O nome de usuário é obrigatório.'],
    unique: true,
    trim: true,
    minlength: [3, 'O nome de usuário deve ter no mínimo 3 caracteres.']
  },
  email: {
    type: String,
    required: [true, 'O email é obrigatório.'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Por favor, insira um email válido.']
  },
  password: {
    type: String,
    required: [true, 'A senha é obrigatória.'],
    minlength: [6, 'A senha deve ter no mínimo 6 caracteres.']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', async function(next) {
  if(!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model('User', userSchema);