import { describe, expect, test, vi } from "vitest";
import Authenticated from "./Authenticated";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { handleCreate, Task } from "../../services/tasks";

vi.mock("../../services/tasks", () => ({
  fetchTasks: vi.fn().mockResolvedValue([
    {
      id: 1,
      text: "Sample task text",
      title: "Test Task",
      due_date: null,
      important: false,
      pending: false,
      completed: false,
      user_id: 1,
    },
  ]),
  handleCreate: vi.fn().mockImplementation((taskData: Partial<Task>) => {
    console.log("handleCreate called with:", taskData);
    return Promise.resolve({
      id: 2,
      ...taskData,
      user_id: 1,
    } as Task);
  }),
}));

describe("Authenticated", () => {
  test("renders with correct loading and displays tasks", async () => {
    render(<Authenticated />);

    const loading = screen.getByText("Loading...");
    expect(loading).toBeInTheDocument();

    await waitFor(() => {
      const taskTitle = screen.getByText("Test Task");
      expect(taskTitle).toBeInTheDocument();
    });
  });

  test("creates a new task and displays it", async () => {
    render(<Authenticated />);

    await waitFor(() => {
      expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    const titleInput = screen.getByLabelText("title") as HTMLInputElement;
    fireEvent.change(titleInput, { target: { value: "New Task" } });

    const addButton = screen.getByRole("button", { name: /add task/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      const newTaskTitle = screen.getByText("New Task");
      expect(newTaskTitle).toBeInTheDocument();
    });

    expect(vi.mocked(handleCreate)).toHaveBeenCalledWith({
      text: null,
      title: "New Task",
      due_date: null,
      important: false,
      pending: false,
      completed: false,
    });
  });
});
