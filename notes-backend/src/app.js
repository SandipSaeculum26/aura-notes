import express from "express";
import cors from "cors";
import noteRoutes from "./routes/note.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/notes", noteRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;