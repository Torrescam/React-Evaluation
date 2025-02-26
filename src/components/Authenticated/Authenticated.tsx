import * as React from "react";
import s from "./Authenticated.module.css";
import { BadgeAlert, FilePenLine, Trash2 } from "lucide-react";
import { filterTasks, sortTasks } from "./utils";
import { useAuth } from "../../contexts/authContext";
import {
  fetchTasks,
  handleCreate,
  handleDelete,
  handleEdit,
  Task,
} from "../../services/tasks";
import Button from "../Button";

type Status = "idle" | "loading" | "error" | "success";

function Authenticated() {
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const { logout } = useAuth();
  const [status, setStatus] = React.useState<Status>("idle");
  const [formStatus, setFormStatus] = React.useState("idle");
  const [isEditOn, setIsEditOn] = React.useState<boolean>(false);
  const [currentTask, setCurrentTask] = React.useState<Task | null>(null);
  const [title, setTitle] = React.useState<string>("");
  const [dueDate, setDueDate] = React.useState<string>("");

  const [sortBy, setSortBy] = React.useState<string>("due_date-asc");
  const [filters, setFilters] = React.useState<{
    onlyPending: boolean;
    onlyImportant: boolean;
  }>({
    onlyPending: false,
    onlyImportant: false,
  });

  React.useEffect(() => {
    const loadTasks = async () => {
      setStatus("loading");
      try {
        const taskFromApi = await fetchTasks();
        setTasks(taskFromApi);
        setStatus("success");
      } catch (error:unknown) {
        const err =error as Error;
        if (err.message === "Unauthorized") {
          logout();
        } else {
          console.error("Error loading task:", error);
          setStatus("error");
        }
      }
    };
    loadTasks();
  }, [logout]);

  function handleLogout() {
    logout();
    console.log("Logout successfull");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    const taskData: Omit<Task, "id" | "user_id"> = {
      text: formData.get("text") as string,
      title: title,
      due_date: dueDate || null,
      important: currentTask ? currentTask.important : false,
      pending: false,
      completed: false,
    };

    setFormStatus("loading");

    try {
      if (isEditOn && currentTask) {
        const updateTask = await handleEdit(currentTask.id, taskData);
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updateTask.id ? updateTask : task
          )
        );
      } else {
        const newTask = await handleCreate(taskData);
        setTasks((prevTasks) => [...prevTasks, newTask]);
      }
      setFormStatus("success");
      setCurrentTask(null);
      setTitle("");
      setDueDate("");
      setIsEditOn(false);
      console.log("Task created successfully");
    } catch (error) {
      console.error("Error creating task:", error);
      setFormStatus("error");
    }
  }

  //mark task as completed
  const toggleTaskCompletion = async (task: Task) => {
    try {
      const updatedTask = await handleEdit(task.id, {
        completed: !task.completed,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
    }
  };

  const toggleTaskImportance = async (task: Task) => {
    try {
      const updatedTask = await handleEdit(task.id, {
        important: !task.important,
      });
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === updatedTask.id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Error toggling task importance:", error);
    }
  };

  function startEditingTask(task: Task) {
    if (isEditOn && currentTask && currentTask.id === task.id) {
      setIsEditOn(false);
      setCurrentTask(null);
      setTitle("");
      setDueDate("");
    } else {
      setIsEditOn(true);
      setCurrentTask(task);
      setTitle(task.title);
      setDueDate(task.due_date || "");
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await handleDelete(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  function handleSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    setSortBy(event.target.value);
  }

  function handleFilterChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { id, checked } = event.target;
    setFilters((preveFilters) => ({
      ...preveFilters,
      [id === "pending" ? "onlyPending" : "onlyImportant"]: checked,
    }));
  }

  const isLoading = status === "loading";
  const isCreating = formStatus === "loading";

  const filteredTasks = filterTasks(tasks, filters);
  const sortedTasks = sortTasks(filteredTasks, sortBy);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  return (
    <>
      <form className={s["task-form"]} onSubmit={handleSubmit}>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="do the dishes"
          required
          aria-label="title"
          disabled={isCreating}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          id="due_date"
          type="date"
          name="due_date"
          aria-label="due_date"
          disabled={isCreating}
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <Button disabled={isCreating}>
          {isEditOn ? "Update Task..." : "Add Task"}
        </Button>
      </form>

      <div className={s["tasks-wrapper"]}>
        <aside className={s.aside}>
          <div className={s["input-group"]}>
            <label htmlFor="sort_by">Sort by</label>
            <select id="sort_by" value={sortBy} onChange={handleSortChange}>
              <option value="due_date-asc">Due Date (old first)</option>
              <option value="due_date-desc">Due Date (new first)</option>
              <option value="alphabetical-asc">Alphabetical (a-z)</option>
              <option value="alphabetical-desc">Alphabetical (z-a)</option>
            </select>
          </div>
          <div className={s["input-group"]}>
            <label>Filter</label>
            <div className={s.checkbox}>
              <input
                type="checkbox"
                id="pending"
                checked={filters.onlyPending}
                onChange={handleFilterChange}
              />
              <label htmlFor="pending">Only pending</label>
            </div>
            <div className={s.checkbox}>
              <input
                type="checkbox"
                id="important"
                checked={filters.onlyImportant}
                onChange={handleFilterChange}
              />
              <label htmlFor="important">Only important</label>
            </div>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </aside>
        <div className={s["tasks-list"]}>
          {isLoading && <p>Loading...</p>}
          {tasks.length > 0 &&
            sortedTasks.map((task: Task) => (
              <div key={task.id} className={s["task-wrapper"]}>
                <div className={s["task-data"]}>
                  <input
                    type="checkbox"
                    id={task.id.toString()}
                    checked={task.completed}
                    onChange={() => toggleTaskCompletion(task)}
                  />
                  <div className={s["title-wrapper"]}>
                    <label
                      htmlFor={task.id.toString()}
                      className={s["task-title"]}
                    >
                      {task.title}
                    </label>
                    <small className={s["task-due_date"]}>
                      {formatDate(task.due_date)}
                    </small>
                  </div>
                </div>
                <div className={s.actions}>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => toggleTaskImportance(task)}
                    title={
                      task.important ? "Remove importance" : "Mark as important"
                    }
                  >
                    <BadgeAlert color={task.important ? "#6D28D9" : "gray"} />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => startEditingTask(task)}
                  >
                    <FilePenLine />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}

export default Authenticated;
