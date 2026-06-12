import type { TaskStatus } from "../types";
import { STATUS_LABELS } from "../utils/status";

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge status-${status}`}>{STATUS_LABELS[status]}</span>;
}
