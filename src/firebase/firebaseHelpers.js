// src/firebase/firebaseHelpers.js
//includes funstions for all CRUD operations
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

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