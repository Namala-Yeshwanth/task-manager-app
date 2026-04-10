import { useState } from "react";
import styles from "./TaskForm.module.css";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await onAdd(title.trim());
      setTitle("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.inputRow}>
        <input
          className={styles.input}
          type="text"
          placeholder="Add a new task..."
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          disabled={loading}
          maxLength={200}
        />
        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <span>+ Add</span>
          )}
        </button>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </form>
  );
}
