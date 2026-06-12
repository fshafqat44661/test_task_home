import { Router } from "express";
import { isValidActor } from "../constants/actors";
import { TaskStatus } from "../models/Task";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getAuditLogsForTask,
  InvalidTransitionError,
  TaskNotFoundError,
  updateTaskStatus,
} from "../services/task.service";

const router = Router();

const TASK_STATUSES: TaskStatus[] = [
  "to_do",
  "pending",
  "in_progress",
  "done",
];

const isTaskStatus = (value: string): value is TaskStatus =>
  TASK_STATUSES.includes(value as TaskStatus);

router.get("/", (_req, res) => {
  res.status(200).json(getAllTasks());
});

router.post("/", (req, res) => {
  const { title } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({ message: "Title is required" });
  }

  const task = createTask(title);
  res.status(201).json(task);
});

router.put("/:id/status", (req, res) => {
  const { status, actor } = req.body;

  if (!status || !isTaskStatus(status)) {
    return res.status(400).json({ message: "Valid status is required" });
  }

  if (!actor || typeof actor !== "string" || !isValidActor(actor)) {
    return res.status(400).json({ message: "Valid actor is required" });
  }

  try {
    const task = updateTaskStatus(req.params.id, status, actor);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof TaskNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    if (error instanceof InvalidTransitionError) {
      return res.status(400).json({ message: error.message });
    }
    throw error;
  }
});

router.get("/:id/audit-logs", (req, res) => {
  try {
    const logs = getAuditLogsForTask(req.params.id);
    res.status(200).json(logs);
  } catch (error) {
    if (error instanceof TaskNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    throw error;
  }
});

router.delete("/:id", (req, res) => {
  try {
    deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error instanceof TaskNotFoundError) {
      return res.status(404).json({ message: error.message });
    }
    throw error;
  }
});

export default router;
