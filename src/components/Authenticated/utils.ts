export function sortTasks(tasks, sortBy) {
  switch (sortBy) {
    case "due_date-desc": {
      return [...tasks].sort(
        (a, b) => new Date(b["due_date"]) - new Date(a["due_date"])
      );
    }
    case "due_date-asc": {
      return [...tasks].sort(
        (a, b) => new Date(a["due_date"]) - new Date(b["due_date"])
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

export function filterTasks(tasks, filters) {
  return tasks.filter((task) => {
    const { onlyPending, onlyImportant } = filters;
    if (onlyPending && onlyImportant) return !task.completed && task.important;
    if (onlyPending) return !task.completed;
    if (onlyImportant) return task.important;
    return true;
  });
}
