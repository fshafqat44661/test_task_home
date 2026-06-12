import type { AuditLog, Task, TaskStatus } from "../types";

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:5000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const fetchTasks = (): Promise<Task[]> => request<Task[]>("/tasks");

export const createTask = (title: string): Promise<Task> =>
  request<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify({ title }),
  });

export const updateTaskStatus = (
  taskId: string,
  status: TaskStatus,
  actor: string
): Promise<Task> =>
  request<Task>(`/tasks/${taskId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status, actor }),
  });

export const deleteTask = (taskId: string): Promise<void> =>
  request<void>(`/tasks/${taskId}`, { method: "DELETE" });

export const fetchAuditLogs = (taskId: string): Promise<AuditLog[]> =>
  request<AuditLog[]>(`/tasks/${taskId}/audit-logs`);

export const fetchActors = (): Promise<string[]> => request<string[]>("/actors");
