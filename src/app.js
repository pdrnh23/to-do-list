const express = require('express');
const app = express();
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');

app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/todos', todoRoutes);

module.exports = app;