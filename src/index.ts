import express, { type Request, type Response, type Application } from "express";
import dotenv from "dotenv";
import {connectDB} from "./config/db.js";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

startServer();