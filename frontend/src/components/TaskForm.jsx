import { useState } from "react";
import axios from "axios";

export default function TaskForm({ onTaskAdded }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title is required!");
      return;
    }

    try {
      setLoading(true); // Show loading state
      const response = await axios.post("http://localhost:3000/tasks", {
        title,
        description,
      });

      console.log("Task added successfully:", response.data);

      if (onTaskAdded) {
        onTaskAdded(response.data); // Update task list in Homepage
      }

      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Error adding task:", error.response ? error.response.data : error.message);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        required
      />
      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.textarea}
      />
      <button type="submit" style={styles.button} disabled={loading}>
        {loading ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

// Inline styles for simple styling
const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    maxWidth: "400px",
    margin: "auto",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
  },
  textarea: {
    padding: "10px",
    fontSize: "16px",
    height: "80px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    cursor: "pointer",
  },
};
