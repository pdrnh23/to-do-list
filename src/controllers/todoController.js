const Todo = require('../models/todoModels');

/*
 * Função auxiliar para formatar erros de validação do Mongoose.
 * Recebe o objeto de erro (error) e retorna um objeto com os campos
 * e suas respectivas mensagens de erro.
 */
const formatValidationError = (error) => {
  const errors = {};
  // Itera sobre as propriedades do objeto 'errors' dentro do objeto 'error'
  for (let field in error.errors) {
    errors[field] = error.errors[field].message; // Extrai a mensagem de erro para cada campo
  }
  return errors;
};


// Controlador para criar uma nova tarefa
exports.createTodo = async (req, res) => {
  try {
    // Desestrutura os dados da tarefa do corpo da requisição
    const { title, description, dueDate, priority } = req.body;
    // Cria uma nova instância do modelo Todo com os dados recebidos
    const newTodo = new Todo({ title, description, dueDate, priority });
    // Salva a nova tarefa no banco de dados
    await newTodo.save();
    // Retorna a tarefa criada com status 201 (Created)
    res.status(201).json(newTodo);
  } catch (error) {
    // Verifica se o erro é uma ValidationError do Mongoose (erros de validação do schema)
    if (error.name === 'ValidationError') {
      // Retorna status 400 (Bad Request) com mensagens de erro detalhadas
      return res.status(400).json({ 
        message: 'Erro de validação',
        errors: formatValidationError(error) // Usa a função auxiliar para formatar os erros
      });
    }
    // Para outros tipos de erro, retorna status 500 (Internal Server Error)
    console.error('Erro ao criar tarefa:', error); // Loga o erro completo no console do servidor
    res.status(500).json({ message: 'Erro interno do servidor ao criar tarefa.', error: error.message });
  }
};

// Controlador para obter todas as tarefas com filtragem
exports.getAllTodos = async (req, res) => {
  try {
    // Extrai os parâmetros de consulta da URL (ex: ?completed=true&priority=1&search=texto)
    const { completed, priority, search } = req.query; 
    let filter = {}; // Inicializa o objeto de filtro que será passado ao Mongoose

    // Aplica filtro por status de conclusão se o parâmetro 'completed' estiver presente
    if (completed !== undefined) { 
      filter.completed = completed === 'true'; // Converte a string 'true'/'false' para booleano
    }

    // Aplica filtro por prioridade se o parâmetro 'priority' estiver presente
    if (priority !== undefined) { 
      const parsedPriority = parseInt(priority); // Converte a prioridade para um número inteiro
      
      // Validação explícita para garantir que a prioridade é um número válido (1, 2 ou 3)
      // Esta validação ocorre ANTES da query ao DB para dar um feedback mais rápido
      if (isNaN(parsedPriority) || ![1, 2, 3].includes(parsedPriority)) {
        return res.status(400).json({ message: 'Prioridade inválida. Use 1 (Alta), 2 (Média) ou 3 (Baixa).' });
      }
      filter.priority = parsedPriority; // Adiciona a prioridade ao objeto de filtro
    }

    // Aplica filtro de busca de texto (no título ou descrição) se o parâmetro 'search' estiver presente
    if (search) {
      // Cria uma expressão regular para buscar o texto (case-insensitive)
      const regex = new RegExp(search, 'i'); 
      // Usa $or para buscar o termo em múltiplos campos (título ou descrição)
      filter.$or = [
        { title: regex }, 
        { description: regex } 
      ];
    }

    // Executa a consulta no Mongoose, aplicando o filtro construído
    const todos = await Todo.find(filter); 

    // Retorna as tarefas encontradas com status 200 (OK)
    res.status(200).json(todos);

  } catch (error) {
    // Loga o erro no console do servidor
    console.error('Erro ao obter todas as tarefas:', error);
    // Retorna status 500 (Internal Server Error) para erros inesperados
    res.status(500).json({ message: 'Erro interno do servidor ao obter tarefas.', error: error.message });
  }
};

// Controlador para obter uma única tarefa por ID
exports.getTodoById = async (req, res) => {
  try {
    // Busca uma tarefa pelo ID fornecido nos parâmetros da URL
    const todo = await Todo.findById(req.params.id);
    // Se a tarefa não for encontrada, retorna status 404 (Not Found)
    if (!todo) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' }); 
    }
    // Retorna a tarefa encontrada com status 200 (OK)
    res.status(200).json(todo);
  } catch (error) {
    // Verifica se o erro é um CastError (ID inválido, formato incorreto)
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'ID de tarefa inválido.' });
    }
    // Para outros erros, retorna status 500
    console.error('Erro ao buscar tarefa por ID:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar tarefa por ID.', error: error.message });
  }
};

// Controlador para atualizar uma tarefa por ID
exports.updateTodo = async (req, res) => {
  try {
    // Desestrutura os dados atualizados da tarefa do corpo da requisição
    const { title, description, completed, dueDate, priority } = req.body;
    
    // Logs para depuração no console do servidor
    console.log('ID para atualização:', req.params.id);
    console.log('Dados recebidos para atualização:', req.body);

    // Encontra e atualiza a tarefa pelo ID.
    // 'new: true' garante que o documento retornado seja o atualizado.
    // 'runValidators: true' executa as validações do schema definidas no modelo.
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, description, completed, dueDate, priority },
      { new: true, runValidators: true }
    );
    // Se a tarefa não for encontrada para atualização, retorna status 404
    if (!todo) {
      console.log('Tarefa não encontrada para o ID:', req.params.id);
      return res.status(404).json({ message: 'Tarefa não encontrada.' }); 
    }
    // Loga a tarefa atualizada no console do servidor
    console.log('Tarefa atualizada com sucesso:', todo);
    // Retorna a tarefa atualizada com status 200 (OK)
    res.status(200).json(todo);
  } catch (error) {
    // Verifica se o erro é uma ValidationError (erros de validação do schema)
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Erro de validação',
        errors: formatValidationError(error) // Formata e retorna os erros de validação
      });
    }
    // Verifica se o erro é um CastError (ID inválido)
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de tarefa inválido.' });
    }
    // Para outros erros, retorna status 500
    console.error('Erro ao atualizar tarefa:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao atualizar tarefa.', error: error.message });
  }
};

// Controlador para deletar uma tarefa por ID
exports.deleteTodo = async (req, res) => {
  try {
    // Encontra e deleta uma tarefa pelo ID
    const todo = await Todo.findByIdAndDelete(req.params.id);
    // Se a tarefa não for encontrada, retorna status 404
    if (!todo) {
      return res.status(404).json({ message: 'Tarefa não encontrada.' }); 
    }
    // Retorna mensagem de sucesso com status 200 (OK)
    res.status(200).json({ message: 'Tarefa deletada com sucesso.' }); 
  } catch (error) {
    // Verifica se o erro é um CastError (ID inválido)
    if (error.name === 'CastError') {
        return res.status(400).json({ message: 'ID de tarefa inválido.' });
    }
    // Para outros erros, retorna status 500
    console.error('Erro ao deletar tarefa:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao deletar tarefa.', error: error.message });
  }
};
