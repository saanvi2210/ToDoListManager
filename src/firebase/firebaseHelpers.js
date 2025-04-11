// src/firebase/firebaseHelpers.js
//includes funstions for all CRUD operations
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const tasksRef = collection(db, "tasks");

export const addTask = async (taskText) => {
    try {
      const docRef = await addDoc(collection(db, "tasks"), {
        text: taskText,
        completed: false,
        createdAt: new Date(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

export const getTasks = async () => {
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};
