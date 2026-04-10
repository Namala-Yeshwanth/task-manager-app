import { useState } from "react";
import styles from "./TaskItem.module.css";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editError, setEditError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await onToggle(task.id, !task.completed);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setLoading(true);
    try {
      await onDelete(task.id);
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSave() {
    if (!editTitle.trim()) {
      setEditError("Title cannot be empty.");
      return;
    }
    if (editTitle.trim() === task.title) {
      setIsEditing(false);
      return;
    }
    setLoading(true);
    try {
      await onEdit(task.id, editTitle.trim());
      setIsEditing(false);
      setEditError("");
    } catch (err) {
      setEditError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleEditKeyDown(e) {
    if (e.key === "Enter") handleEditSave();
    if (e.key === "Escape") {
      setIsEditing(false);
      setEditTitle(task.title);
      setEditError("");
    }
  }

  const formattedDate = new Date(task.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div className={`${styles.item} ${task.completed ? styles.completed : ""} ${loading ? styles.loading : ""}`}>
      {/* Checkbox */}
      <button
        className={`${styles.checkbox} ${task.completed ? styles.checked : ""}`}
        onClick={handleToggle}
        disabled={loading}
        title={task.completed ? "Mark incomplete" : "Mark complete"}
        aria-label="Toggle completion"
      >
        {task.completed && (
          <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
            <path d="M1 4L4 7.5L10 1" stroke="#0d0d0d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </button>

      {/* Title / Edit */}
      <div className={styles.content}>
        {isEditing ? (
          <div className={styles.editRow}>
            <input
              className={styles.editInput}
              value={editTitle}
              onChange={(e) => { setEditTitle(e.target.value); setEditError(""); }}
              onKeyDown={handleEditKeyDown}
              autoFocus
              maxLength={200}
            />
            <button className={styles.saveBtn} onClick={handleEditSave} disabled={loading}>Save</button>
            <button className={styles.cancelBtn} onClick={() => { setIsEditing(false); setEditTitle(task.title); setEditError(""); }}>✕</button>
            {editError && <span className={styles.editError}>{editError}</span>}
          </div>
        ) : (
          <div className={styles.titleRow}>
            <span className={styles.title}>{task.title}</span>
            <span className={styles.badge}>
              {task.completed ? "completed" : "pending"}
            </span>
          </div>
        )}
        <span className={styles.date}>{formattedDate}</span>
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className={styles.actions}>
          <button
            className={styles.editBtn}
            onClick={() => setIsEditing(true)}
            disabled={loading}
            title="Edit task"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 1.5L12.5 4.5M1 13H4L12.5 4.5L9.5 1.5L1 10V13Z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            className={styles.deleteBtn}
            onClick={handleDelete}
            disabled={loading}
            title="Delete task"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 3.5H12M5 3.5V2.5H9V3.5M5.5 6V10.5M8.5 6V10.5M3 3.5L3.5 11.5H10.5L11 3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
