"use client"
import { useAuth } from "@/hooks/useAuth.js"
import { useRouter } from "next/navigation"
import TodoApp from "../components/TodoApp"
import CalendarWithTasks from "../components/CalendarWithTasks"
import { motion } from "framer-motion"
import { LogOut, Rocket } from "lucide-react"
import { signOut } from "firebase/auth"
import { auth } from "../firebase/firebaseConfig"
import SelectedTask from "../components/SelectedTask"
import { TaskProvider } from "../context/taskContext"

function Tasks() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      window.location.reload()
    } catch (error) {
      console.error("Error logging out:", error)
    }
  }

  // While Firebase is checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 flex items-center justify-center">
        <div className="text-blue-600 text-xl font-medium">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>
            Loading...
          </div>
        </div>
      </div>
    )
  }

  // If no user is signed in, redirect to login
  if (!user) {
    if (typeof window !== "undefined") router.push("/login")
    return null
  }

  return (
    <TaskProvider>
       <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50 p-6 md:p-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto z-10 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 pt-4">
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

        {/* Main Content - Two Column Layout */}
        <div className="flex w-full bg-gradient-to-br from-blue-50 via-white to-sky-50">
          {/* TodoApp Column */}
          <div className="w-[50%]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TodoApp user={user} />
          </motion.div>
          </div>
          <div className="w-[50%]">
          <SelectedTask/>
          </div>
          
        
        </div>
        {/* Calendar Column */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CalendarWithTasks user={user} />
          </motion.div>
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
    </TaskProvider>
   
  )
}

export default Tasks
