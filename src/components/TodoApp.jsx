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

export default function TodoApp({ user }) {
  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState([])
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [editingText, setEditingText] = useState("")
  const [priority, setPriority] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [hoveredTaskId, setHoveredTaskId] = useState(null)

  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid), where("completed", "==", false))
    const querySnapshot = await getDocs(q)
    const tasks = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        text: typeof data.text === "object" ? data.text.text : data.text, // flatten if needed
        ...data,
      }
    })
    // sort tasks by due date
    tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))

    setTasks(tasks)
  }

  const handleAdd = () => {
    setShowDetailsDialog(true) // open dialog instead of adding directly
  }

  const handleConfirmDetails = async () => {
    addTask(input, priority, dueDate, user)
    fetchTasks()
    setInput("")
    setPriority("")
    setDueDate("")
    setShowDetailsDialog(false)
  }

  const handleDelete = async (id) => {
    await deleteTask(id)
    fetchTasks()
  }

  const handleUpdate = async (id, updatedTask) => {
    await updateTask(id, updatedTask)
    fetchTasks()
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.reload()
    } catch (error) {
      console.error("Error logging out:", error)
    }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Header - Logo on left, Logout on right */}
      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="flex justify-between items-center mb-12 pt-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2"
          >
            <h1 className="text-3xl font-bold text-blue-900">
              Daily<span className="text-blue-600">Drive</span>
            </h1>
            <motion.div
              animate={{ rotate: [0, 10, 0], y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              <Rocket className="text-blue-500 h-6 w-6" />
            </motion.div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white text-blue-600 px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 border border-blue-100"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </motion.button>
        </div>

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
              open={showDetailsDialog}
              onOpenChange={setShowDetailsDialog}
              setPriority={setPriority}
              setDueDate={setDueDate}
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

                      {/* Task Details Popup - Improved version */}
                      <AnimatePresence>
                        {hoveredTaskId === task.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-full ml-4 w-64 p-4 rounded-xl shadow-lg bg-white border border-blue-100 z-20"
                            style={{ top: "0%", transform: "translateY(-50%)" }}
                          >
                            <div className="relative">
                              {/* Connector */}
                              <div className="absolute top-1/2 -left-8 w-8 h-px bg-blue-100"></div>

                              {/* Header with priority indicator */}
                              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-blue-50">
                                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                                <h4 className="font-medium text-blue-900">Task Details</h4>
                              </div>

                              {/* Task name */}
                              <div className="mb-3">
                                <p className="text-sm font-medium text-gray-800 break-words">{task.text}</p>
                              </div>

                              {/* Due date */}
                              <div className="flex items-center gap-2 mb-2">
                                <Calendar className="h-4 w-4 text-blue-400" />
                                <p className="text-sm text-gray-600">
                                  {task.dueDate ? formatDate(task.dueDate) : "No deadline set"}
                                </p>
                              </div>

                              {/* Priority */}
                              <div className="flex items-center gap-2">
                                <Flag className="h-4 w-4 text-blue-400" />
                                <p className="text-sm text-gray-600">
                                  Priority:{" "}
                                  <span className={`font-medium ${getPriorityTextColor(task.priority)}`}>
                                    {task.priority || "None"}
                                  </span>
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {editingTaskId === task.id ? (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={async () => {
                              await handleUpdate(task.id, { text: editingText })
                              setEditingTaskId(null)
                              setEditingText("")
                            }}
                            className="text-green-600 hover:text-green-800 text-sm font-medium px-3 py-1 rounded-md bg-green-50"
                          >
                            Save
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              setEditingTaskId(null)
                              setEditingText("")
                            }}
                            className="text-gray-500 hover:text-gray-700 text-sm px-3 py-1 rounded-md bg-gray-50"
                          >
                            Cancel
                          </motion.button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 ml-auto">
                          {/* Priority indicator moved to the right */}
                         
                          <motion.button
                            whileHover={{ scale: 0}}
                            
                            className="text-blue-500 block group-hover:hidden"
                          >
                            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)} mr-3`}></div>
                          </motion.button>
                          {/* Action buttons that appear on hover */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => {
                              setEditingTaskId(task.id)
                              setEditingText(task.text)
                            }}
                            className="text-blue-500 hidden group-hover:block"
                          >
                            <Edit className="h-5 w-5" />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(task.id)}
                            className="text-red-500 hidden group-hover:block"
                          >
                            <Trash2 className="h-5 w-5" />
                          </motion.button>
                        </div>
                      )}
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
