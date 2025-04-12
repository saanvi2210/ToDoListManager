// src/firebase/firebaseHelpers.js
//includes funstions for all CRUD operations
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebaseConfig";
import { v4 as uuidv4 } from 'uuid';


const tasksRef = collection(db, "tasks");

export const addTask = async (text, priority, dueDate, user) => {
  await addDoc(collection(db,  "tasks"), {
    text: text,
      uid: user.uid,
      createdAt: new Date(),
      completed: false,
    priority: priority || "medium",
    dueDate: dueDate || null
  })
  };

export const addSubTask = async(task, subtaskText,priority)=>{
  try {
    const subtask = {
      id: uuidv4(),
      text: subtaskText,
      completed: false,
      priority: priority
    };

    const taskRef = doc(db, 'tasks', task.id);
    await updateDoc(taskRef, {
      subtasks: arrayUnion(subtask),
    });

  } catch (error) {
    console.error('Error adding subtask:', error);
  }

}

export const getTasks = async () => {
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};

export const updateTask = async (id, newText) => {
  const taskRef = doc(db, "tasks", id);
  await updateDoc(taskRef, {
    text: newText.text,
    updatedAt: new Date(),
  });
};

export const markAsComplete = async(id) => {
  const taskRef = doc(db, "tasks", id);
  await updateDoc(taskRef, {
    completed: true,
    updatedAt: new Date(),
  });
}