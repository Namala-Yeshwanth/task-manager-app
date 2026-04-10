const request = require("supertest");
const fs = require("fs");
const path = require("path");

// ─── Point DB_FILE to a temp test file so we never touch real data ────────────
const TEST_DB = path.join(__dirname, "../tasks.test.json");
process.env.NODE_ENV = "test";

// Override the DB path before loading the app
jest.mock("path", () => {
  const actualPath = jest.requireActual("path");
  return {
    ...actualPath,
    join: (...args) => {
      const result = actualPath.join(...args);
      // Redirect tasks.json to tasks.test.json during tests
      return result.replace("tasks.json", "tasks.test.json");
    },
  };
});

const app = require("../index");

// Clean up test DB before and after all tests
beforeAll(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

afterAll(() => {
  if (fs.existsSync(TEST_DB)) fs.unlinkSync(TEST_DB);
});

// ─── Test Suite ───────────────────────────────────────────────────────────────

describe("GET /tasks", () => {
  it("should return 200 and an array of tasks", async () => {
    const res = await request(app).get("/tasks");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });
});

describe("POST /tasks", () => {
  it("should create a task and return 201", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Test task from Jest" });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Test task from Jest");
    expect(res.body.data.completed).toBe(false);
    expect(res.body.data.id).toBeDefined();
    expect(res.body.data.createdAt).toBeDefined();
  });

  it("should return 400 when title is empty", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "" });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBeDefined();
  });

  it("should return 400 when title is missing", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should trim whitespace from title", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "   Padded title   " });

    expect(res.statusCode).toBe(201);
    expect(res.body.data.title).toBe("Padded title");
  });
});

describe("PATCH /tasks/:id", () => {
  let taskId;

  beforeEach(async () => {
    // Create a fresh task before each test in this block
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Task to update" });
    taskId = res.body.data.id;
  });

  it("should toggle completed to true", async () => {
    const res = await request(app)
      .patch(`/tasks/${taskId}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.completed).toBe(true);
  });

  it("should update task title", async () => {
    const res = await request(app)
      .patch(`/tasks/${taskId}`)
      .send({ title: "Updated title" });

    expect(res.statusCode).toBe(200);
    expect(res.body.data.title).toBe("Updated title");
  });

  it("should return 404 for non-existent task id", async () => {
    const res = await request(app)
      .patch("/tasks/non-existent-id-12345")
      .send({ completed: true });

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Task not found.");
  });

  it("should return 400 when title is empty string", async () => {
    const res = await request(app)
      .patch(`/tasks/${taskId}`)
      .send({ title: "   " });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe("DELETE /tasks/:id", () => {
  let taskId;

  beforeEach(async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ title: "Task to delete" });
    taskId = res.body.data.id;
  });

  it("should delete a task and return 200", async () => {
    const res = await request(app).delete(`/tasks/${taskId}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Task deleted successfully.");
  });

  it("should return 404 when deleting a non-existent task", async () => {
    const res = await request(app).delete("/tasks/fake-id-999");

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("Task not found.");
  });

  it("should actually remove the task from the list", async () => {
    await request(app).delete(`/tasks/${taskId}`);

    const res = await request(app).get("/tasks");
    const ids = res.body.data.map((t) => t.id);
    expect(ids).not.toContain(taskId);
  });
});