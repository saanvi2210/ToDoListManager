// src/components/TodoApp.js
"use client"
import React, { useEffect, useState } from "react";
import { addTask, getTasks, deleteTask } from "../firebase/firebaseHelpers";

export default function TodoApp() {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const result = await getTasks();
    setTasks(result);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    console.log("Adding task")
    if (input.trim() !== "") {
      await addTask(input);
      setInput("");
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  return (
    <div className="todo-container">
      <h2>📝 Firebase To-Do List</h2>
      <input
        placeholder="Add a task..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleAdd}>Add</button>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.text}{" "}
            <button onClick={() => handleDelete(task.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
