const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const PORT = 3000;

const app = express();
const db = new Database("todo.db");

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

// Tworzenie tabeli SQL
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

const getTodos = db.prepare(`
  SELECT id, title, completed, created_at
  FROM todos
  ORDER BY id DESC
`);

const getTodo = db.prepare(`
  SELECT id, title, completed, created_at
  FROM todos
  WHERE id = ?
`);

function formatTodo(todo) {
  return {
    ...todo,
    completed: Boolean(todo.completed)
  };
}

// GET: pobierz wszystkie zadania
app.get("/api/todos", (req, res) => {
  res.json(getTodos.all().map(formatTodo));
});

// GET: pobierz jedno zadanie
app.get("/api/todos/:id", (req, res) => {
  const todo = getTodo.get(req.params.id);

  if (!todo) {
    return res.status(404).json({ error: "Nie znaleziono zadania" });
  }

  res.json(formatTodo(todo));
});

// POST: dodaj zadanie
app.post("/api/todos", (req, res) => {
  const title = req.body.title?.trim();

  if (!title) {
    return res.status(400).json({ error: "Nazwa zadania jest wymagana" });
  }

  const result = db.prepare(`
    INSERT INTO todos (title) VALUES (?)
  `).run(title);

  res.status(201).json(formatTodo(getTodo.get(result.lastInsertRowid)));
});

// DELETE: usuń zadanie
app.delete("/api/todos/:id", (req, res) => {
  const result = db.prepare(`
    DELETE FROM todos WHERE id = ?
  `).run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Nie znaleziono zadania" });
  }

  res.status(204).end();
});

// Obsługa błędów JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({ error: "Nieprawidłowy JSON" });
  }

  console.error(err);
  res.status(500).json({ error: "Błąd serwera" });
});

const server = app.listen(PORT, "127.0.0.1", () => {
  console.log(`Serwer działa: http://localhost:${PORT}`);
  console.log("Baza danych: server/todos.db");
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);