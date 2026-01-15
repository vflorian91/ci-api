const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'ci-api', time: new Date().toISOString() });
});

// “Base de datos” en memoria
let tasks = []; // { id, title, done }

// CRUD básico
app.get('/api/v1/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/api/v1/tasks', (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title is required' });
  const task = { id: String(Date.now()), title, done: false };
  tasks.push(task);
  res.status(201).json(task);
});

app.get('/api/v1/tasks/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'not found' });
  res.json(task);
});

app.put('/api/v1/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const { title, done } = req.body || {};
  if (typeof title !== 'undefined') tasks[idx].title = title;
  if (typeof done !== 'undefined') tasks[idx].done = !!done;
  res.json(tasks[idx]);
});

app.delete('/api/v1/tasks/:id', (req, res) => {
  const idx = tasks.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'not found' });
  const deleted = tasks.splice(idx, 1)[0];
  res.json(deleted);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
// evidencia DEV 
