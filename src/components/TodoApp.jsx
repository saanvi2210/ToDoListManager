"use client"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db, auth } from "../firebase/firebaseConfig"
import { addTask, deleteTask, markAsComplete, updateTask } from "../firebase/firebaseHelpers"
import { signOut } from "firebase/auth"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, LogOut, Plus, Rocket, Calendar, Flag, Edit, Trash2 } from "lucide-react"
import "../app/globals.css"
import TaskDetailsDialog from "./TaskDetailsDialog"
import SubtaskManager from "./Subtask"
import { useTask } from "../context/taskContext"

export default function TodoApp({ user }) {
  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState([])
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [hoveredTaskId, setHoveredTaskId] = useState(null)
  const { selectedTask, setSelectedTask } = useTask();

  const fetchTasks = async () => {
    if (!user?.uid) return;

    const userTasksRef = collection(db, "users", user.uid, "tasks");

    const q = query(userTasksRef, where("completed", "==", false));
    const querySnapshot = await getDocs(q);

    const tasks = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        text: typeof data.text === "object" ? data.text.text : data.text, // flatten if needed
        ...data,
      };
    });

    // Sort tasks by due date
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

    setTasks(tasks);
  };
  const handleAdd = () => {
    setShowDetailsDialog(true) // open dialog instead of adding directly
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  // Function to format date in a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "No date set"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-blue-300"
    }
  }

  // Get priority text color
  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-blue-300"
    }
  }

  const handleConfirmDetails = async (newDetails) => {
      console.log(newDetails)
      await addTask(newDetails, user)
      console.log("new details added")
      setInput("")
      setShowDetailsDialog(false)
      fetchTasks()
    }

  return (
    <div className="min-h-screen  p-6 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header - Logo on left, Logout on right */}
      <div className="max-w-6xl mx-auto z-10 relative">


        {/* Main Content - Centered */}
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mb-8 w-full max-w-3xl"
          >
            <h2 className="text-4xl font-serif mb-8 text-blue-400 text-center">TASK MANAGEMENT</h2>

            <div className="flex gap-3 mb-10">
              <input
                className="flex-1 px-5 py-4 rounded-lg border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm text-gray-700"
                placeholder="Add a new task..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg shadow-md flex items-center gap-2 min-w-[140px] justify-center"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </motion.button>
            </div>
            <TaskDetailsDialog
            type = 'main'
            input = {input}
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            onConfirm={handleConfirmDetails}
            />

            {tasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-blue-400">
                <p className="text-lg">No tasks yet. Add your first task to get started!</p>
              </motion.div>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task, index) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="relative flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-300 group"
                    onMouseEnter={() => setHoveredTaskId(task.id)}
                    onMouseLeave={() => setHoveredTaskId(null)}
                    onClick={() => {
                      setSelectedTask(task)
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div
                        onClick={async () => {
                          await markAsComplete(task.id)
                          setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: true } : t)))
                        }}
                        className="cursor-pointer"
                      >
                        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                          {!task.completed ? (
                            <CheckCircle className="text-blue-500 h-5 w-5" />
                          ) : (
                            <CheckCircle className="text-gray-300 h-5 w-5" />
                          )}
                        </motion.div>
                      </div>


                      {editingTaskId === task.id ? (
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-3 py-1 rounded-md border border-blue-200 text-blue-800 focus:outline-none focus:ring-1 focus:ring-blue-400"
                          autoFocus
                        />
                      ) : (
                        <span className="text-blue-800 flex-1">{task.text}</span>
                      )}




                      <div className="flex items-center gap-3 ml-auto">
                        {/* Priority indicator moved to the right */}


                        <motion.button


                          className="text-blue-500 block "
                        >
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} mr-3`}></div>
                        </motion.button>




                      </div>

                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center text-blue-500 text-sm mb-8"
        >
          <p>Organize and manage your workflow like a pro with DailyDrive</p>
        </motion.div>
      </div>
    </div>
  )
}
