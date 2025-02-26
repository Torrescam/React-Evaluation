import { baseUrl, tokenKey } from "../constants";

export interface Task {
  id: number;
  text: string;
  title: string;
  due_date: string | null;
  important: boolean;
  pending: boolean;
  completed: boolean;
  user_id: number;
}

export const getToken = () => {
  return window.localStorage.getItem(tokenKey);
};

export async function fetchTasks(): Promise<Task[]> {
  const token = getToken();

  const response = await fetch(`${baseUrl}/tasks`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error("Unauthorized");
    }
    throw new Error("Error getting tasks");
  }

  const data: Task[] = await response.json();
  return data;
}

// create task
export async function handleCreate(
  newTask: Omit<Task, "id" | "user_id">
): Promise<Task> {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },

    body: JSON.stringify(newTask),
  });

  if (!response.ok) {
    throw new Error("Error creating task" + response.statusText);
  }
  const data = await response.json();
  return data;
}

// editar task
export async function handleEdit(
  id: number,
  updates: Partial<Task>
): Promise<Task> {
  const response = await fetch(`${baseUrl}/tasks/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  if (!response.ok) {
    throw new Error("Error editing task");
  }
  const data = await response.json();
  return data;
}

// eliminar task
export async function handleDelete(id: number): Promise<void> {
  const response = await fetch(`${baseUrl}/tasks/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error deleting task");
  }
}



