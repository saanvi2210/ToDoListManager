import { createContext, useContext, useState } from "react";

// Create the context
const TaskContext = createContext();

// Create a provider component
export const TaskProvider = ({ children }) => {
  const [selectedTask, setSelectedTask] = useState(null);

  return (
    <TaskContext.Provider value={{ selectedTask, setSelectedTask }}>
      {children}
    </TaskContext.Provider>
  );
};

// Custom hook to use the context easily
export const useTask = () => useContext(TaskContext);
