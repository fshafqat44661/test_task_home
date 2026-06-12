import type { Task } from "../types";
import { getNextStatus, STATUS_LABELS } from "../utils/status";
import { StatusBadge } from "./StatusBadge";

interface TaskItemProps {
  task: Task;
  actors: string[];
  selectedActor: string;
  isUpdating: boolean;
  onActorChange: (actor: string) => void;
  onAdvanceStatus: (taskId: string) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
  onViewAuditLogs: (task: Task) => void;
}

export function TaskItem({
  task,
  actors,
  selectedActor,
  isUpdating,
  onActorChange,
  onAdvanceStatus,
  onDelete,
  onViewAuditLogs,
}: TaskItemProps) {
  const nextStatus = getNextStatus(task.status);

  return (
    <article className="card task-item">
      <div className="task-main">
        <div>
          <h3>{task.title}</h3>
          <p className="muted">Created {new Date(task.createdAt).toLocaleString()}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      <div className="task-actions">
        {nextStatus ? (
          <div className="action-group">
            <label htmlFor={`actor-${task.id}`}>Actor</label>
            <select
              id={`actor-${task.id}`}
              value={selectedActor}
              onChange={(event) => onActorChange(event.target.value)}
              disabled={isUpdating}
            >
              {actors.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
            <button
              type="button"
              disabled={isUpdating || !selectedActor}
              onClick={() => onAdvanceStatus(task.id)}
            >
              {isUpdating
                ? "Updating..."
                : `Move to ${STATUS_LABELS[nextStatus]}`}
            </button>
          </div>
        ) : (
          <p className="muted">Task completed.</p>
        )}

        <div className="action-group secondary-actions">
          <button type="button" className="secondary" onClick={() => onViewAuditLogs(task)}>
            View Audit Logs
          </button>
          <button
            type="button"
            className="danger"
            disabled={isUpdating}
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
