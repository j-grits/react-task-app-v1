const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to SQLite database
const db = new sqlite3.Database("todos.db");

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Create todos table if not exists
db.serialize(() => {
  db.run(
    "CREATE TABLE IF NOT EXISTS todos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, category TEXT)"
  );
});

// GET all todos
app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM todos", (error, rows) => {
    if (error) {
      console.error("Error fetching todos:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json(rows);
    }
  });
});

// POST a new todo
app.post("/api/todos", (req, res) => {
  const { text, category } = req.body;
  const query = "INSERT INTO todos (text, category) VALUES (?, ?)";
  db.run(query, [text, category], function (error) {
    if (error) {
      console.error("Error adding todo:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(201).json({ id: this.lastID, text, category });
    }
  });
});

// PUT(update) an existing todo
app.put("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const { text, category } = req.body;
  const query = "UPDATE todos SET text = ?, category = ? WHERE id = ?";
  db.run(query, [text, category, id], function (error) {
    if (error) {
      console.error("Error updating todo:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.json({ id, text, category });
    }
  });
});

// DELETE a todo
app.delete("/api/todos/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM todos WHERE id = ?";
  db.run(query, [id], function (error) {
    if (error) {
      console.error("Error deleting todo:", error);
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(204).end();
    }
  });
});
