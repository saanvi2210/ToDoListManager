// src/firebase/firebaseHelpers.js
//includes funstions for all CRUD operations
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const tasksRef = collection(db, "tasks");

export const addTask = async (text, user) => {
    await addDoc(collection(db, "tasks"), {
      text,
      uid: user.uid,
      createdAt: new Date(),
    });
  };

export const getTasks = async () => {
  const snapshot = await getDocs(tasksRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const deleteTask = async (id) => {
  await deleteDoc(doc(db, "tasks", id));
};
