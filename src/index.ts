import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 2999;

// Middleware
app.use(express.json());

// Serve static frontend
app.use(express.static(path.join(__dirname, "..", "public")));

// API routes
app.use("/api", userRoutes);

// Fallback to index.html
app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
