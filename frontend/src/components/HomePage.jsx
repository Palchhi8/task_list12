import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskCard from "./TaskCard";
import "./HomePage.css"; // Import the corresponding CSS

const HomePage = () => {
    const [tasks, setTasks] = useState([]); // State to store tasks

    // Fetch tasks from the backend when component mounts
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await axios.get("http://localhost:3000/tasks");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Function to handle task addition
    const handleTaskAdded = (newTask) => {
        setTasks((prevTasks) => [newTask, ...prevTasks]); // Add new task to list
    };

    return (
        <div className="home-page">
            <h2>Task Manager</h2>

            {/* Task Form */}
            <TaskForm onTaskAdded={handleTaskAdded} />

            {/* Display Tasks */}
            {tasks.length === 0 ? (
                <p>No tasks available. Add a new task!</p>
            ) : (
                <div className="task-list">
                    {tasks.map((task) => (
                        <TaskCard key={task._id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;
