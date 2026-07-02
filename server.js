const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// In-memory "database" (just an array)
let todos = [];
let nextId = 1; // Simple ID counter

// ============ ROUTES ============

// 1. GET /todos → Get all todos
app.get('/todos', (req, res) => {
  res.json({
    success: true,
    count: todos.length,
    data: todos
  });
});

// 2. GET /todos/:id → Get a single todo
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  res.json({ success: true, data: todo });
});

// 3. POST /todos → Create a new todo
app.post('/todos', (req, res) => {
  const { title, description } = req.body;

  // Validation
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required'
    });
  }

  const newTodo = {
    id: nextId++,
    title,
    description: description || '',
    completed: false,
    createdAt: new Date()
  };

  todos.push(newTodo);

  res.status(201).json({
    success: true,
    message: 'Todo created successfully',
    data: newTodo
  });
});

// 4. PUT /todos/:id → Update a todo
app.put('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  const { title, description, completed } = req.body;

  // Update only the fields provided
  if (title !== undefined) todo.title = title;
  if (description !== undefined) todo.description = description;
  if (completed !== undefined) todo.completed = completed;

  res.json({
    success: true,
    message: 'Todo updated successfully',
    data: todo
  });
});

// 5. DELETE /todos/:id → Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Todo not found'
    });
  }

  const deletedTodo = todos.splice(index, 1)[0];

  res.json({
    success: true,
    message: 'Todo deleted successfully',
    data: deletedTodo
  });
});

// ============ SERVER ============
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});