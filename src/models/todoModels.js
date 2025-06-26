const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'O título é obrigatório.'],
    trim: true,
    minlength: [3, 'O título deve ter no mínimo 3 caracteres.'],
    maxlength: [100, 'O título deve ter no máximo 100 caracteres.']
  },
  description: {
    type: String,
    trim: true,
    default: '',
    maxlength: [500, 'A descrição deve ter no máximo 500 caracteres.']
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    // Validador personalizado para garantir que a data seja futura ou atual (em UTC)
    validate: {
      validator: function(v) {
        if (v === null || v === undefined) { // Permite que seja null ou undefined
          return true;
        }
        // Obtém a data atual no início do dia em UTC para comparação
        const todayUTC = new Date();
        todayUTC.setUTCHours(0, 0, 0, 0); // Define para o início do dia em UTC

        // Compara a data de vencimento (v) com a data de hoje em UTC
        // Certifica-se que 'v' também é um objeto Date para comparação
        return v >= todayUTC;
      },
      message: props => `${props.value} não é uma data de vencimento válida. Deve ser uma data futura ou atual.`
    }
  },
  priority: {
    type: Number,
    default: 3,
    enum: {
      values: [1, 2, 3],
      message: 'A prioridade deve ser 1 (Alta), 2 (Média) ou 3 (Baixa).'
    }
  }
});

module.exports = mongoose.model('Todo', todoSchema);