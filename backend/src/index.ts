import express from "express";
import cors from "cors";
import taskRouter from "./routes/task.routes";
import { ACTORS } from "./constants/actors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Backend is running", status: "success" });
});

app.get("/actors", (_req, res) => {
  res.status(200).json(ACTORS);
});

app.use("/tasks", taskRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on PORT ${port}`);
});
