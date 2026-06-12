import { useCallback, useEffect, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchActors,
  fetchAuditLogs,
  fetchTasks,
  updateTaskStatus,
} from "../api/client";
import type { AuditLog, Task } from "../types";
import { getNextStatus } from "../utils/status";
import { AuditLogModal } from "./AuditLogModal";
import { CreateTaskForm } from "./CreateTaskForm";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [actors, setActors] = useState<string[]>([]);
  const [selectedActor, setSelectedActor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [auditTask, setAuditTask] = useState<Task | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [taskData, actorData] = await Promise.all([fetchTasks(), fetchActors()]);
      setTasks(taskData);
      setActors(actorData);
      setSelectedActor(actorData[0] ?? "");
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  const handleCreateTask = async (title: string) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const task = await createTask(title);
      setTasks((current) => [task, ...current]);
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvanceStatus = async (taskId: string) => {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) {
      return;
    }

    const nextStatus = getNextStatus(task.status);
    if (!nextStatus || !selectedActor) {
      return;
    }

    setUpdatingTaskId(taskId);
    setError(null);

    try {
      const updatedTask = await updateTaskStatus(taskId, nextStatus, selectedActor);
      setTasks((current) =>
        current.map((item) => (item.id === taskId ? updatedTask : item))
      );
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Failed to update status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    setUpdatingTaskId(taskId);
    setError(null);

    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((item) => item.id !== taskId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete task");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleViewAuditLogs = async (task: Task) => {
    setAuditTask(task);
    setAuditLogs([]);
    setAuditLoading(true);
    setAuditError(null);

    try {
      const logs = await fetchAuditLogs(task.id);
      setAuditLogs(logs);
    } catch (logsError) {
      setAuditError(
        logsError instanceof Error ? logsError.message : "Failed to load audit logs"
      );
    } finally {
      setAuditLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="page-header">
        <div>
          <h1>Mini Task Manager</h1>
          <p className="muted">
            Track task status changes with immutable audit history.
          </p>
        </div>
      </header>

      <CreateTaskForm onCreate={handleCreateTask} isSubmitting={isSubmitting} />

      {error && <p className="error banner">{error}</p>}

      <section className="task-section">
        <div className="section-header">
          <h2>Tasks</h2>
          <span className="muted">{tasks.length} total</span>
        </div>

        {isLoading && <p>Loading tasks...</p>}

        {!isLoading && tasks.length === 0 && (
          <div className="card empty-state">
            <p>No tasks yet. Create your first task above.</p>
          </div>
        )}

        <div className="task-grid">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              actors={actors}
              selectedActor={selectedActor}
              isUpdating={updatingTaskId === task.id}
              onActorChange={setSelectedActor}
              onAdvanceStatus={handleAdvanceStatus}
              onDelete={handleDeleteTask}
              onViewAuditLogs={handleViewAuditLogs}
            />
          ))}
        </div>
      </section>

      {auditTask && (
        <AuditLogModal
          taskTitle={auditTask.title}
          logs={auditLogs}
          isLoading={auditLoading}
          error={auditError}
          onClose={() => setAuditTask(null)}
        />
      )}
    </div>
  );
}
