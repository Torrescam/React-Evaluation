import { Task } from "../../services/tasks";

export function sortTasks(tasks: Task[], sortBy: string) {
  switch (sortBy) {
    case "due_date-desc": {
      return [...tasks].sort(
        (a, b) =>
          new Date(b.due_date ?? "").getTime() -
          new Date(a.due_date ?? "").getTime()
      );
    }
    case "due_date-asc": {
      return [...tasks].sort(
        (a, b) =>
          new Date(a.due_date ?? "").getTime() -
          new Date(b.due_date ?? "").getTime()
      );
    }
    case "alphabetical-asc": {
      return [...tasks].sort((a, b) => (a.title < b.title ? -1 : 1));
    }
    case "alphabetical-desc": {
      return [...tasks].sort((a, b) => (b.title <= a.title ? -1 : 1));
    }
    default:
      return tasks;
  }
}

export function filterTasks(
  tasks: Task[],
  filters: { onlyPending: boolean; onlyImportant: boolean }
): Task[] {
  return tasks.filter((task) => {
    const { onlyPending, onlyImportant } = filters;
    if (onlyPending && onlyImportant) return !task.completed && task.important;
    if (onlyPending) return !task.completed;
    if (onlyImportant) return task.important;
    return true;
  });
}
