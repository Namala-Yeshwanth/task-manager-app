## 🔗 Live Demo
Frontend: https://task-manager-app-frontend-1piheivua-namala-yeshwanths-projects.vercel.app/
API: https://task-manager-app-backend-lu0y.onrender.com/

# Task Manager

A full stack Task Manager app built with React (Vite) on the frontend and Node.js + Express on the backend.

## Features

- View all tasks with completion status badges
- Add new tasks with validation
- Mark tasks complete / incomplete (toggle)
- Edit task titles inline
- Delete tasks
- Filter by All / Pending / Completed (with counts)
- Progress bar showing completion ratio
- Loading and error states throughout
- **Tasks persist after server restart** (file-based storage)
- Clean REST API with validation and proper HTTP status codes

## Stack

| Layer     | Tech                              |
|-----------|-----------------------------------|
| Frontend  | React 18, Vite, CSS Modules       |
| Backend   | Node.js, Express                  |
| Storage   | JSON file (tasks.json)            |
| IDs       | uuid v4                           |
| Testing   | Jest + Supertest                  |

---

## Setup & Run

### 1. Backend

```bash
cd backend
npm install
npm start          # production
npm run dev        # development (auto-restarts on file change via nodemon)
```

Backend runs on: `http://localhost:3001`

### 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## Running Tests

```bash
cd backend
npm install
npm test
```

Jest will run all tests in `tests/tasks.test.js` and show a pass/fail summary.

---

## API Reference

| Method | Endpoint       | Description               | Body                         |
|--------|----------------|---------------------------|------------------------------|
| GET    | /tasks         | Get all tasks             | —                            |
| POST   | /tasks         | Create a task             | `{ "title": "string" }`      |
| PATCH  | /tasks/:id     | Update title or status    | `{ "title"?, "completed"? }` |
| DELETE | /tasks/:id     | Delete a task             | —                            |

All responses: `{ success: true, data: ... }` or `{ success: false, error: "..." }`

---

## Project Structure

```
task-manager/
├── .gitignore
├── README.md
├── backend/
│   ├── index.js              # Express app entry point (exported for testing)
│   ├── package.json          # Includes nodemon, jest, supertest
│   ├── tasks.json            # Auto-created on first run (gitignored)
│   ├── routes/
│   │   └── tasks.js          # All CRUD routes + file persistence
│   └── tests/
│       └── tasks.test.js     # 11 tests covering all endpoints
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── App.module.css
        ├── api/
        │   └── tasks.js      # Centralized fetch calls
        └── components/
            ├── TaskForm.jsx + TaskForm.module.css
            ├── TaskItem.jsx + TaskItem.module.css
            └── TaskList.jsx  + TaskList.module.css
```

---

## Assumptions & Trade-offs

- **File-based storage**: Tasks are saved to `tasks.json` after every change and survive server restarts. For a production app, this would be replaced with a proper database like MongoDB or PostgreSQL.
- **No authentication**: The API is open — appropriate for a local dev exercise.
- **CORS open for all origins**: Configured for local development convenience.
- **No pagination**: Kept simple since this is a small exercise.
- **Bonus features included**: Filter tabs, inline title editing, file persistence, nodemon, tests.
