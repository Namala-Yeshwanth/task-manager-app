const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// ─── File-based persistence ───────────────────────────────────────────────────
const DB_FILE = path.join(__dirname, "../tasks.json");

// Load tasks from file on startup. If file doesn't exist, seed with sample tasks.
function loadTasks() {
  if (fs.existsSync(DB_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    } catch {
      console.warn("tasks.json was corrupted, starting fresh.");
      return [];
    }
  }
  // Seed data for first run
  return [
    {
      id: uuidv4(),
      title: "Review project requirements",
      completed: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: uuidv4(),
      title: "Set up development environment",
      completed: false,
      createdAt: new Date(Date.now() - 43200000).toISOString(),
    },
    {
      id: uuidv4(),
      title: "Build the task manager app",
      completed: false,
      createdAt: new Date().toISOString(),
    },
  ];
}

// Save tasks array to file after every change
function saveTasks(tasks) {
  fs.writeFileSync(DB_FILE, JSON.stringify(tasks, null, 2), "utf8");
}

let tasks = loadTasks();
saveTasks(tasks); // ensure file exists from the start

// ─── Routes ───────────────────────────────────────────────────────────────────

// GET /tasks — return all tasks
router.get("/", (req, res) => {
  res.status(200).json({ success: true, data: tasks });
});

// POST /tasks — create a new task
router.post("/", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res
      .status(400)
      .json({ success: false, error: "Title is required and must be a non-empty string." });
  }

  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks(tasks); // persist after create
  res.status(201).json({ success: true, data: newTask });
});

// PATCH /tasks/:id — update task (toggle completed or update title)
router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { completed, title } = req.body;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, error: "Task not found." });
  }

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim() === "") {
      return res
        .status(400)
        .json({ success: false, error: "Title must be a non-empty string." });
    }
    tasks[taskIndex].title = title.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return res
        .status(400)
        .json({ success: false, error: "Completed must be a boolean." });
    }
    tasks[taskIndex].completed = completed;
  }

  saveTasks(tasks); // persist after update
  res.status(200).json({ success: true, data: tasks[taskIndex] });
});

// DELETE /tasks/:id — delete a task
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ success: false, error: "Task not found." });
  }

  tasks.splice(taskIndex, 1);
  saveTasks(tasks); // persist after delete
  res.status(200).json({ success: true, message: "Task deleted successfully." });
});

module.exports = router;
