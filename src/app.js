const express = require("express");
const dotenv = require("dotenv").config();
const { connectDB } = require("../src/config/db");

const accessRoutes = require("./routes/access.routes");
const urlRoutes = require("./routes/url.routes");
const authRoutes = require("./routes/auth.routes");
const redirectRoutes = require("./routes/redirect.routes");

const app = express();

// Custom CORS Middleware to allow requests dynamically from the frontend origin
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();

// Remapped routes to match specification
app.use("/api/auth", authRoutes);
app.use("/api/access", accessRoutes);
app.use("/api/url", urlRoutes);
app.use("/", redirectRoutes);

// Health Check
app.get("/health", (req, res) => {
  return res.send("Server is running fine");
});

// Self-ping to prevent Render free tier spin-down
// Pings every 14 minutes (Render spins down after 15 min of inactivity)
const PING_INTERVAL_MS = 14 * 60 * 1000; // 14 minutes

const pingServer = () => {
  const serverUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${process.env.PORT || 5000}`;

  setInterval(async () => {
    try {
      const response = await fetch(`${serverUrl}/health`);
      console.log(`[Self-Ping] ${new Date().toISOString()} — Status: ${response.status}`);
    } catch (error) {
      console.error(`[Self-Ping] Failed:`, error.message);
    }
  }, PING_INTERVAL_MS);
};

pingServer();

module.exports = { app };
