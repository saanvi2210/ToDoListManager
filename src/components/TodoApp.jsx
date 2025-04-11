// src/components/TodoApp.js
"use client";
import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../firebase/firebaseConfig"; // make sure this points to your db instance
import { addTask, deleteTask } from "../firebase/firebaseHelpers";
import { signOut } from "firebase/auth";


export default function TodoApp({user}) {
  const [input, setInput] = useState("");
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    const tasks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(tasks);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    console.log("Adding task")
    if (input.trim() !== "") {
      await addTask(input, user);
      setInput("");
      fetchTasks();
    }
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.location.reload(); // or navigate to login page if using Next.js router
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="todo-container">
      <h2>📝 Firebase To-Do List</h2>
      <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
      Logout
    </button>
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
