import { TaskStatus } from "../models/Task";

const FLOW: TaskStatus[] = ["to_do", "pending", "in_progress", "done"];

export const isValidTransition = (current: TaskStatus, next: TaskStatus) => {
  return FLOW.indexOf(next) === FLOW.indexOf(current) + 1;
};
