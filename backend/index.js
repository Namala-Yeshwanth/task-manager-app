const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasks");

const app = express();
const PORT = 3001;

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    const allowedPatterns = [
      /\.vercel\.app$/,        // any Vercel deployment
      /localhost:\d+$/,        // any localhost port
    ];

    const isAllowed = allowedPatterns.some((pattern) => pattern.test(origin));
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
}));

app.use(express.json());

app.use("/tasks", taskRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Only start listening if this file is run directly (not imported by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task Manager API running on http://localhost:${PORT}`);
  });
}

// Export app for testing with supertest
module.exports = app;
