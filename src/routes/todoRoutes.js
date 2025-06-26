const express = require('express'); 
const router = express.Router();
const todoController = require('../controllers/todoController');

//Criar uma nova tarefa
router.post('/', todoController.createTodo);

//Obter todas as tarefas
router.get('/', todoController.getAllTodos);

//Obter uma única tarefa por ID
router.get('/:id', todoController.getTodoById);

//Atualizar uma tarefa por ID
router.put('/:id', todoController.updateTodo);

//Deletar uma tarefa por ID
router.delete('/:id', todoController.deleteTodo);

module.exports = router;