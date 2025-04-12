"use client"
import { useEffect, useState } from "react"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db, auth } from "../firebase/firebaseConfig"
import { addTask, deleteTask } from "../firebase/firebaseHelpers"
import { signOut } from "firebase/auth"
import { motion } from "framer-motion"
import { CheckCircle, LogOut, Plus, Rocket } from "lucide-react"
import '../app/globals.css'

export default function TodoApp({ user }) {
  const [input, setInput] = useState("")
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const q = query(collection(db, "tasks"), where("uid", "==", user.uid))
    const querySnapshot = await getDocs(q)
    const tasks = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    setTasks(tasks)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleAdd = async () => {
    if (input.trim() !== "") {
      await addTask(input, user)
      setInput("")
      fetchTasks()
    }
  }

  const handleDelete = async (id) => {
    await deleteTask(id)
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
            <h2 className="text-3xl font-serif mb-8 text-blue-400 text-center">TASK MANAGEMENT</h2>

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

            {tasks.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10 text-blue-400">
                <p className="text-lg">No tasks yet. Add your first task to get started!</p>
              </motion.div>
            ) : (
              <ul className="space-y-3">
                {tasks.map((task, index) => (
                  <motion.li
                    key={task.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm group"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle className="text-blue-500 h-5 w-5" />
                      <span className="text-blue-800">{task.text}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </motion.button>
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
