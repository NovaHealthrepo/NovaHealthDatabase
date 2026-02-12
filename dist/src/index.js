import dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import indexRoutes from "./routes/indexRoutes.js";
import basicAuth from 'express-basic-auth';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 2999;
// Middleware
app.use(express.json());
// Basic Auth - protect all routes
app.use(basicAuth({
    users: { 'admin': process.env.MY_PASSWORD }, // 帳號是 admin，密碼從 Render 環境變數讀取
    challenge: true, // 會跳出瀏覽器內建的登入視窗
    realm: 'My Private Database',
}));
// Serve static frontend
app.use(express.static(path.join(__dirname, "..", "public")));
// Serve index management frontend
app.use("/index-manager", express.static(path.join(__dirname, "..", "public-index")));
// API routes
app.use("/api", userRoutes);
app.use("/api", indexRoutes);
// Fallback to index.html
app.get("/", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});
app.get("/index-manager", (_req, res) => {
    res.sendFile(path.join(__dirname, "..", "public-index", "index.html"));
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
