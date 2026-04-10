# Task Manager

A full stack Task Manager application built with React on the frontend and Node.js + Express on the backend.

## 🔗 Live Demo
- **Frontend:** https://task-manager-app-frontend-lsfryecr4-namala-yeshwanths-projects.vercel.app
- **API:** https://task-manager-app-backend-lu0y.onrender.com

> ⚠️ The backend is hosted on Render's free tier and may take 30–60 seconds to wake up on first visit.

---

## Features

- View all tasks with status badges (pending / completed)
- Add new tasks with validation
- Mark tasks complete or incomplete
- Edit task titles inline
- Delete tasks
- Filter tasks by All / Pending / Completed
- Progress bar showing completion ratio
- Tasks persist after server restart (file-based storage)
- Loading and error states throughout the UI

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, CSS Modules |
| Backend | Node.js, Express |
| Storage | JSON file (tasks.json) |
| Testing | Jest, Supertest |
| Dev Tool | Nodemon |

---

## Project Structure

```
task-manager/
├── README.md
├── .gitignore
├── backend/
│   ├── index.js              # Express app entry point
│   ├── package.json
│   ├── nodemon.json          # Ignores tasks.json to prevent restart loop
│   ├── tasks.json            # Auto-created on first run (gitignored)
│   ├── routes/
│   │   └── tasks.js          # All CRUD routes + file persistence
│   └── tests/
│       └── tasks.test.js     # 12 tests covering all endpoints
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
        │   └── tasks.js      # All API calls centralized here
        └── components/
            ├── TaskForm.jsx
            ├── TaskItem.jsx
            └── TaskList.jsx
```

---

## Setup & Run Instructions

### Prerequisites
Make sure you have these installed:
- [Node.js](https://nodejs.org) v18 or higher
- npm (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### 2. Run the Backend

```bash
cd backend
npm install
npm start
```

Backend runs on: `http://localhost:3001`

For development with auto-restart:
```bash
npm run dev
```

### 3. Run the Frontend

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
npm test
```

Expected output:
```
PASS tests/tasks.test.js
  GET /tasks
    ✓ should return 200 and an array of tasks
  POST /tasks
    ✓ should create a task and return 201
    ✓ should return 400 when title is empty
    ✓ should return 400 when title is missing
    ✓ should trim whitespace from title
  PATCH /tasks/:id
    ✓ should toggle completed to true
    ✓ should update task title
    ✓ should return 404 for non-existent task id
    ✓ should return 400 when title is empty string
  DELETE /tasks/:id
    ✓ should delete a task and return 200
    ✓ should return 404 when deleting a non-existent task
    ✓ should actually remove the task from the list

Tests: 12 passed, 12 total
```

---

## API Reference

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/tasks` | Get all tasks | — |
| POST | `/tasks` | Create a task | `{ "title": "string" }` |
| PATCH | `/tasks/:id` | Update title or status | `{ "title"?: "string", "completed"?: boolean }` |
| DELETE | `/tasks/:id` | Delete a task | — |

### Response Format

All responses follow a consistent structure:

**Success:**
```json
{
  "success": true,
  "data": { "id": "uuid", "title": "Buy groceries", "completed": false, "createdAt": "2026-04-10T05:30:00.000Z" }
}
```

**Error:**
```json
{
  "success": false,
  "error": "Title is required and must be a non-empty string."
}
```

### HTTP Status Codes Used

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error (bad input) |
| 404 | Resource not found |
| 500 | Internal server error |

---

## Assumptions & Trade-offs

### Storage — JSON File Instead of a Database
Tasks are stored in a `tasks.json` file on the server. This was a deliberate choice given the 1–2 hour scope of the exercise. It keeps the setup simple — no database installation required — while still achieving persistence across server restarts.

**Trade-off:** In a production application this would be replaced with a proper database (e.g. MongoDB or PostgreSQL) to handle concurrent writes safely and support scaling.

### No Authentication
The API has no authentication layer. Any user can create, edit, or delete any task. This is appropriate for a local development exercise but would not be acceptable in production where each user should only see and manage their own tasks.

### CORS Configuration
CORS is open to all origins in development (`*`). In production the `FRONTEND_URL` environment variable is used to restrict access to the deployed frontend domain only.

### In-Memory State During Tests
Tests run against a separate `tasks.test.json` file that is created before each test run and deleted afterward. This ensures tests never affect real data and can run cleanly in any environment.

### No Pagination
The task list loads all tasks in a single request. For this exercise this is fine, but a real application with many tasks would need pagination or infinite scroll.

### Bonus Features Included
The following bonus items from the spec were implemented:
- Filter tasks by completed or incomplete status
- Edit an existing task title
- Persist tasks after refresh (file-based storage)
- Basic tests (Jest + Supertest, 12 tests)

---

## Environment Variables

### Backend

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port the server listens on |
| `FRONTEND_URL` | `*` | Allowed CORS origin in production |

### Frontend

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3001` | Backend API base URL |proper database like MongoDB or PostgreSQL.
- **No authentication**: The API is open — appropriate for a local dev exercise.
- **CORS open for all origins**: Configured for local development convenience.
- **No pagination**: Kept simple since this is a small exercise.
- **Bonus features included**: Filter tabs, inline title editing, file persistence, nodemon, tests.

<img width="1838" height="864" alt="image" src="https://github.com/user-attachments/assets/45a41422-dc38-4a22-a775-c12cfaba886c" />

