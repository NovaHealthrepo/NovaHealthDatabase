import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import basicAuth from 'express-basic-auth'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In production (dist/src/index.js), go up 2 levels to reach project root.
// In dev (src/index.ts via tsx), go up 1 level.
const isCompiled = __dirname.includes("dist");
const projectRoot = isCompiled
  ? path.join(__dirname, "..", "..")
  : path.join(__dirname, "..");

const app = express();
const PORT = Number(process.env.PORT) || 2999;

// Middleware
app.use(express.json());

// Basic Auth - protect all routes
app.use(basicAuth({
    users: { 'admin': process.env.MY_PASSWORD || 'admin' }, // 帳號是 admin，密碼從 Render 環境變數讀取
    challenge: true, // 會跳出瀏覽器內建的登入視窗
    realm: 'My Private Database',
}));

// Serve static frontend
app.use(express.static(path.join(projectRoot, "public")));

// Serve index management frontend
app.use("/index-manager", express.static(path.join(projectRoot, "public-index")));

// API routes
app.use("/api", userRoutes);
app.use("/api", indexRoutes);

// Fallback to index.html
app.get("/", (_req, res) => {
  res.sendFile(path.join(projectRoot, "public", "index.html"));
});

app.get("/index-manager", (_req, res) => {
  res.sendFile(path.join(projectRoot, "public-index", "index.html"));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Project root: ${projectRoot}`);
  console.log(`📁 Public dir exists: ${fs.existsSync(path.join(projectRoot, 'public'))}`);
  console.log(`📁 Public-index dir exists: ${fs.existsSync(path.join(projectRoot, 'public-index'))}`);
  console.log(`🔑 MY_PASSWORD set: ${!!process.env.MY_PASSWORD}`);
  console.log(`🔗 DATABASE_URL set: ${!!process.env.DATABASE_URL}`);
});
