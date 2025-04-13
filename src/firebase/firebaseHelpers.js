// src/firebase/firebaseHelpers.js
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion
} from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from "uuid";

// Add a task to the user's nested tasks collection
export const addTask = async (taskDetails, user) => {
  if (!user?.uid) return;

  const userTasksRef = collection(db, "users", user.uid, "tasks");

  await addDoc(userTasksRef, {

    text: taskDetails.text,
    createdAt: new Date(),
    completed: false,
    priority: taskDetails.priority || "medium",
    dueDate: taskDetails.dueDate || null,
    title: taskDetails.title,
    subtasks: [] // initialize empty array
  });
};

// Add a subtask to a task document
export const addSubTask = async (user,taskId, stask) => {
  try {
    if (!user?.uid) return;

    const subtask = {
      id: uuidv4(),
      text: stask.text,
      completed: false,
    };

    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    await updateDoc(taskRef, {
      subtasks: arrayUnion(subtask)
    });

  } catch (error) {
    console.error("Error adding subtask:", error);
  }
};

// Get all tasks for the current user
export const getTasks = async (user) => {
  if (!user?.uid) return [];

  const userTasksRef = collection(db, "users", user.uid, "tasks");
  const snapshot = await getDocs(userTasksRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Delete a user's task
export const deleteTask = async (user, taskId) => {
  if (!user?.uid) return;

  const taskRef = doc(db, "users", user.uid, "tasks", taskId);
  await deleteDoc(taskRef);
};

//Delete a user's subtask
export const deleteSubtask = async (user, taskId, subtaskId) => {
  if (!user?.uid || !taskId || !subtaskId) return;

  try {
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const taskData = taskSnap.data();
      const currentSubtasks = taskData.subtasks || [];

      const updatedSubtasks = currentSubtasks.filter(
        (subtask) => subtask.id !== subtaskId
      );

      await updateDoc(taskRef, { subtasks: updatedSubtasks });
      console.log("Subtask deleted successfully");
    } else {
      console.error("Task not found");
    }
  } catch (error) {
    console.error("Error deleting subtask:", error);
  }
};

//Update a user's subtask
export const updateSubtask = async (user, taskId, subtaskId, newText) => {
  if (!user?.uid || !taskId || !subtaskId) return;

  try {
    const taskRef = doc(db, "users", user.uid, "tasks", taskId);
    const taskSnap = await getDoc(taskRef);

    if (taskSnap.exists()) {
      const taskData = taskSnap.data();
      const currentSubtasks = taskData.subtasks || [];

      const updatedSubtasks = currentSubtasks.map(
        (subtask) => subtask.id !== subtaskId ? subtask : {id: subtask.id,
          text: newText,
          completed: subtask.completed
        }
      );

      await updateDoc(taskRef, { subtasks: updatedSubtasks });
      console.log("Subtask updated successfully");
    } else {
      console.error("Task not found");
    }
  } catch (error) {
    console.error("Error updating subtask:", error);
  }
};

// Update a task's text
export const updateTask = async (user, taskId, updatedDetails) => {
  if (!user?.uid) return;

  const taskRef = doc(db, "users", user.uid, "tasks", taskId);
  await updateDoc(taskRef, {
    text: updatedDetails.text,
    dueDate: updatedDetails.dueDate,
    title: updatedDetails.title,
    priority: updatedDetails.priority,
    updatedAt: new Date()
  });
};

// Mark a task as complete
export const markAsComplete = async (user, taskId) => {
  if (!user?.uid) return;

  const taskRef = doc(db, "users", user.uid, "tasks", taskId);
  await updateDoc(taskRef, {
    completed: true,
    updatedAt: new Date()
  });
};
