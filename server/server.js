import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("client"));
app.use(express.json());

app.use("/user", authRoutes);

app.listen(PORT, () =>
  console.log(`Server listening at: http://localhost:${PORT}`)
);
