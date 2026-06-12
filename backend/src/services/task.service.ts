import { v4 as uuidv4 } from "uuid";
import { AuditLog } from "../models/AuditLog";
import { Task, TaskStatus } from "../models/Task";
import { isValidTransition } from "../utils/statusFlow";
import { readDb, writeDb } from "./db.service";

export class TaskNotFoundError extends Error {
  constructor() {
    super("Task not found");
    this.name = "TaskNotFoundError";
  }
}

export class InvalidTransitionError extends Error {
  constructor() {
    super("Invalid status transition");
    this.name = "InvalidTransitionError";
  }
}

export const getAllTasks = (): Task[] => {
  const db = readDb();
  return db.tasks;
};

export const createTask = (title: string): Task => {
  const db = readDb();

  const newTask: Task = {
    id: uuidv4(),
    title: title.trim(),
    status: "to_do",
    createdAt: new Date().toISOString(),
  };

  db.tasks.push(newTask);
  writeDb(db);

  return newTask;
};

export const deleteTask = (taskId: string): void => {
  const db = readDb();
  const index = db.tasks.findIndex((task) => task.id === taskId);

  if (index === -1) {
    throw new TaskNotFoundError();
  }

  db.tasks.splice(index, 1);
  writeDb(db);
};

export const updateTaskStatus = (
  taskId: string,
  newStatus: TaskStatus,
  actor: string
): Task => {
  const db = readDb();
  const task = db.tasks.find((item) => item.id === taskId);

  if (!task) {
    throw new TaskNotFoundError();
  }

  if (task.status === newStatus) {
    return task;
  }

  if (!isValidTransition(task.status, newStatus)) {
    throw new InvalidTransitionError();
  }

  const auditLog: AuditLog = {
    id: uuidv4(),
    taskId: task.id,
    actor,
    fromStatus: task.status,
    toStatus: newStatus,
    timestamp: new Date().toISOString(),
  };

  db.auditLogs.push(auditLog);
  task.status = newStatus;
  writeDb(db);

  return task;
};

export const getAuditLogsForTask = (taskId: string): AuditLog[] => {
  const db = readDb();
  const taskExists =
    db.tasks.some((task) => task.id === taskId) ||
    db.auditLogs.some((log) => log.taskId === taskId);

  if (!taskExists) {
    throw new TaskNotFoundError();
  }

  return db.auditLogs
    .filter((log) => log.taskId === taskId)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
};
