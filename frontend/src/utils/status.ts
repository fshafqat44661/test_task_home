import type { TaskStatus } from "../types";

export const STATUS_FLOW: TaskStatus[] = [
  "to_do",
  "pending",
  "in_progress",
  "done",
];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  to_do: "To Do",
  pending: "Pending",
  in_progress: "In Progress",
  done: "Done",
};

export const getNextStatus = (current: TaskStatus): TaskStatus | null => {
  const index = STATUS_FLOW.indexOf(current);
  if (index === -1 || index === STATUS_FLOW.length - 1) {
    return null;
  }
  return STATUS_FLOW[index + 1];
};

export const formatTimestamp = (timestamp: string): string =>
  new Date(timestamp).toLocaleString();
