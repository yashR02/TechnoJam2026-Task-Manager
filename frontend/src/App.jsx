import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://technojam-task-manager-api1.onrender.com/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // =========================
  // GET ALL TASKS
  // =========================
  const fetchTasks = async () => {
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // ADD / UPDATE TASK
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title.");
      return;
    }

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, {
          title,
          description,
        });
      } else {
        await axios.post(API_URL, {
          title,
          description,
        });
      }

      setTitle("");
      setDescription("");
      setEditingId(null);

      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task.");
    }
  };

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // =========================
  // EDIT TASK
  // =========================
  const editTask = (task) => {
    setTitle(task.title);
    setDescription(task.description || "");
    setEditingId(task._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // COMPLETE / UNCOMPLETE
  // =========================
  const toggleComplete = async (task) => {
    try {
      await axios.put(`${API_URL}/${task._id}`, {
        completed: !task.completed,
      });

      fetchTasks();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setTitle("");
    setDescription("");
    setEditingId(null);
  };

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesFilter =
      filter === "all"
        ? true
        : filter === "completed"
        ? task.completed
        : !task.completed;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app">

      {/* =========================
          MOTIVATIONAL STICKERS
      ========================= */}

      <div className="sticker sticker-cat">
        🐱
        <span>You Got This! ❤️</span>
      </div>

      <div className="sticker sticker-note">
        📝
        <span>
          Big Goals,
          <br />
          Small Steps ✨
        </span>
      </div>

      <div className="sticker sticker-bulb">
        💡
        <span>
          Good Ideas
          <br />
          Build Great Things
        </span>
      </div>

      <div className="sticker sticker-mountain">
        🏔️
        <span>Keep Going! 💪</span>
      </div>

      <div className="sticker sticker-panda">
        🐼
        <span>You Can Do It! ❤️</span>
      </div>

      {/* =========================
          HEADER
      ========================= */}

      <header className="header">
        <h1>📝 Task Manager</h1>

        <p>
          Organize your work, track your progress and get things done 🚀
        </p>
      </header>

      {/* =========================
          ADD / EDIT TASK
      ========================= */}

      <section className="task-form-section">

        <h2>
          {editingId ? "✏️ Edit Task" : "➕ Add New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="task-form">

          <input
            type="text"
            placeholder="Enter task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            placeholder="Enter task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
          />

          <div className="form-buttons">

            <button type="submit" className="add-btn">
              {editingId ? "💾 Update Task" : "➕ Add Task"}
            </button>

            {editingId && (
              <button
                type="button"
                className="cancel-btn"
                onClick={cancelEdit}
              >
                ❌ Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      {/* =========================
          SEARCH + FILTER
      ========================= */}

      <section className="controls">

        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <div className="filter-buttons">

          <button
            className={filter === "all" ? "active-filter" : ""}
            onClick={() => setFilter("all")}
          >
            📋 All
          </button>

          <button
            className={filter === "pending" ? "active-filter" : ""}
            onClick={() => setFilter("pending")}
          >
            ⏳ Pending
          </button>

          <button
            className={filter === "completed" ? "active-filter" : ""}
            onClick={() => setFilter("completed")}
          >
            ✅ Completed
          </button>

        </div>

      </section>

      {/* =========================
          TASK LIST
      ========================= */}

      <section className="tasks-section">

        <div className="tasks-header">
          <h2>📋 Your Tasks</h2>

          <span className="task-count">
            {filteredTasks.length}{" "}
            {filteredTasks.length === 1 ? "Task" : "Tasks"}
          </span>
        </div>

        {filteredTasks.length === 0 ? (

          <div className="empty-state">
            <div className="empty-icon">📭</div>

            <h3>No tasks found</h3>

            <p>
              Add a new task and start getting things done! 🚀
            </p>
          </div>

        ) : (

          <div className="task-list">

            {filteredTasks.map((task) => (

              <div
                className={`task-card ${
                  task.completed ? "completed-task" : ""
                }`}
                key={task._id}
              >

                <div className="task-content">

                  <h3>{task.title}</h3>

                  {task.description && (
                    <p>{task.description}</p>
                  )}

                  <div className="task-status">

                    {task.completed ? (
                      <span className="completed-status">
                        ✅ Completed
                      </span>
                    ) : (
                      <span className="pending-status">
                        ⏳ Pending
                      </span>
                    )}

                  </div>

                </div>

                <div className="task-actions">

                  <button
                    className="complete-btn"
                    onClick={() => toggleComplete(task)}
                  >
                    {task.completed
                      ? "↩️ Undo"
                      : "✅ Complete"}
                  </button>

                  <button
                    className="edit-btn"
                    onClick={() => editTask(task)}
                  >
                    ✏️ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteTask(task._id)}
                  >
                    🗑️ Delete
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

      {/* =========================
          FOOTER
      ========================= */}

      <div className="motivation">
        ✨ Progress, not perfection. Keep going! 💙 ✨
      </div>

    </div>
  );
}

export default App;