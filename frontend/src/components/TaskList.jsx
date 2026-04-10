import TaskItem from "./TaskItem";
import styles from "./TaskList.module.css";

const FILTERS = ["all", "pending", "completed"];

export default function TaskList({ tasks, loading, error, filter, onFilterChange, onToggle, onDelete, onEdit }) {
  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  const counts = {
    all: tasks.length,
    pending: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
  };

  if (loading) {
    return (
      <div className={styles.centered}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.centered}>
        <div className={styles.errorIcon}>!</div>
        <p className={styles.errorText}>{error}</p>
        <p className={styles.errorSub}>Make sure the backend is running on port 3001.</p>
      </div>
    );
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ""}`}
            onClick={() => onFilterChange(f)}
          >
            {f}
            <span className={styles.count}>{counts[f]}</span>
          </button>
        ))}
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>○</span>
          <p>{filter === "all" ? "No tasks yet. Add one above." : `No ${filter} tasks.`}</p>
        </div>
      ) : (
        <ul className={styles.list}>
          {filtered.map((task) => (
            <li key={task.id}>
              <TaskItem
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
