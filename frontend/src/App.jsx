import { useState, useEffect } from "react";
import { getTasks, createTask, updateTask, deleteTask } from "./api/tasks";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import styles from "./App.module.css";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    setLoading(true);
    setError("");
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      setError(err.message || "Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd(title) {
    const res = await createTask(title);
    setTasks((prev) => [res.data, ...prev]);
  }

  async function handleToggle(id, completed) {
    const res = await updateTask(id, { completed });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  }

  async function handleDelete(id) {
    await deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleEdit(id, title) {
    const res = await updateTask(id, { title });
    setTasks((prev) => prev.map((t) => (t.id === id ? res.data : t)));
  }

  const completedCount = tasks.filter((t) => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <div className={styles.headerTop}>
            <div>
              <div className={styles.label}>TASK MANAGER</div>
              <h1 className={styles.title}>My Tasks</h1>
            </div>
            <div className={styles.statsBox}>
              <div className={styles.statNum}>{tasks.length}</div>
              <div className={styles.statLabel}>total</div>
            </div>
          </div>

          {/* Progress bar */}
          {tasks.length > 0 && (
            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className={styles.progressText}>
                {completedCount}/{tasks.length} done
              </span>
            </div>
          )}
        </header>

        {/* Add task form */}
        <TaskForm onAdd={handleAdd} />

        {/* Task list */}
        <TaskList
          tasks={tasks}
          loading={loading}
          error={error}
          filter={filter}
          onFilterChange={setFilter}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      </div>
    </div>
  );
}
