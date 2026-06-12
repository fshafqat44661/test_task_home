import type { AuditLog } from "../types";
import { formatTimestamp, STATUS_LABELS } from "../utils/status";

interface AuditLogModalProps {
  taskTitle: string;
  logs: AuditLog[];
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
}

export function AuditLogModal({
  taskTitle,
  logs,
  isLoading,
  error,
  onClose,
}: AuditLogModalProps) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2>Audit History</h2>
            <p className="muted">{taskTitle}</p>
          </div>
          <button type="button" className="secondary" onClick={onClose}>
            Close
          </button>
        </div>

        {isLoading && <p>Loading audit logs...</p>}
        {error && <p className="error">{error}</p>}

        {!isLoading && !error && logs.length === 0 && (
          <p className="muted">No status changes recorded yet.</p>
        )}

        {!isLoading && !error && logs.length > 0 && (
          <ol className="audit-list">
            {logs.map((log) => (
              <li key={log.id} className="audit-item">
                <div className="audit-meta">
                  <strong>{log.actor}</strong>
                  <span>{formatTimestamp(log.timestamp)}</span>
                </div>
                <p>
                  {STATUS_LABELS[log.fromStatus]} → {STATUS_LABELS[log.toStatus]}
                </p>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
