"use client"
import { useEffect, useState } from "react"
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  parseISO,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
} from "date-fns"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, CalendarIcon, Clock, Flag } from "lucide-react"

const CalendarWithTasks = ({ user }) => {
  const [tasks, setTasks] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Get days for the calendar view (including days from prev/next month to fill the grid)
  const getDaysForCalendarView = (month) => {
    const start = startOfWeek(startOfMonth(month))
    const end = endOfWeek(endOfMonth(month))
    return eachDayOfInterval({ start, end })
  }

  const calendarDays = getDaysForCalendarView(currentMonth)
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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

  const tasksForSelectedDate = selectedDate
    ? tasks.filter((task) => {
        try {
          return task.dueDate && isSameDay(parseISO(task.dueDate), selectedDate)
        } catch {
          return false
        }
      })
    : []

  const fetchTasks = async () => {
    try {
      const q = query(collection(db, "tasks"), where("uid", "==", user.uid), where("completed", "==", false))
      const querySnapshot = await getDocs(q)
      const fetchedTasks = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          text: typeof data.text === "object" ? data.text.text : data.text,
          dueDate: data.dueDate,
          priority: data.priority,
        }
      })

      fetchedTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

      setTasks(fetchedTasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const formatTaskDate = (dateString) => {
    try {
      const date = parseISO(dateString)
      return format(date, "h:mm a")
    } catch {
      return ""
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [user])

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-blue-100 w-full">
      <h2 className="text-3xl font-serif mb-6 text-blue-400 text-center">CALENDAR VIEW</h2>

      <div className="flex flex-col lg:flex-row gap-12 p-10 pt-4 ">
        {/* Calendar */}
        <div className="lg:w-3/5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-md border border-blue-50 overflow-hidden"
          >
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevMonth}
                  className="p-1 rounded-full hover:bg-blue-400/30"
                >
                  <ChevronLeft size={20} />
                </motion.button>

                <h3 className="text-xl font-medium">{format(currentMonth, "MMMM yyyy")}</h3>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextMonth}
                  className="p-1 rounded-full hover:bg-blue-400/30"
                >
                  <ChevronRight size={20} />
                </motion.button>
              </div>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 bg-blue-50">
              {weekDays.map((day) => (
                <div key={day} className="py-2 text-center text-sm font-medium text-blue-700">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-px bg-blue-100 m-2">
              {calendarDays.map((day) => {
                // Get tasks for this day
                const dayTasks = tasks.filter((task) => {
                  try {
                    return task.dueDate && isSameDay(parseISO(task.dueDate), day)
                  } catch {
                    return false
                  }
                })

                // Determine cell styling
                const isSelected = isSameDay(day, selectedDate)
                const isCurrentMonth = isSameMonth(day, currentMonth)
                const isTodayDate = isToday(day)

                return (
                  <motion.button
                    key={day.toISOString()}
                    whileHover={{ scale: 0.98 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedDate(day)}
                    className={`
                      relative h-24 p-1 bg-white flex flex-col items-start
                      ${!isCurrentMonth ? "text-gray-400" : ""}
                      ${isSelected ? "ring-2 ring-blue-500 z-10" : ""}
                      ${isTodayDate ? "bg-blue-50" : ""}
                    `}
                  >
                    <div
                      className={`
                      flex items-center justify-center w-7 h-7 mb-1 rounded-full
                      ${isTodayDate ? "bg-blue-500 text-white" : ""}
                      ${isSelected && !isTodayDate ? "bg-blue-100" : ""}
                    `}
                    >
                      {format(day, "d")}
                    </div>

                    <div className="w-full overflow-hidden">
                      {dayTasks.length > 0 && (
                        <div className="flex flex-col gap-1">
                          {dayTasks.slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className={`
                                text-xs truncate px-1 py-0.5 rounded-sm
                                ${getPriorityTextColor(task.priority)} bg-opacity-10
                                ${
                                  task.priority === "high"
                                    ? "bg-red-100"
                                    : task.priority === "medium"
                                      ? "bg-yellow-100"
                                      : "bg-green-100"
                                }
                              `}
                            >
                              {task.text}
                            </div>
                          ))}
                          {dayTasks.length > 2 && (
                            <div className="text-xs text-blue-500 px-1">+{dayTasks.length - 2} more</div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:w-2/5 bg-white rounded-xl shadow-md border border-blue-50 p-4"
        >
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-blue-100">
            <CalendarIcon className="text-blue-500" size={18} />
            <h3 className="text-lg font-medium text-blue-800">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDate.toISOString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {tasksForSelectedDate.length > 0 ? (
                <ul className="space-y-3">
                  {tasksForSelectedDate.map((task) => (
                    <motion.li
                      key={task.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-3 rounded-lg border border-blue-50 shadow-sm hover:shadow-md transition-shadow duration-200 bg-gradient-to-r from-white to-blue-50"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-2 h-full self-stretch ${getPriorityColor(task.priority)} rounded-full`}
                        ></div>
                        <div className="flex-1">
                          <h4 className="font-medium text-blue-900">{task.text}</h4>

                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock size={14} />
                              <span>{formatTaskDate(task.dueDate)}</span>
                            </div>

                            <div className="flex items-center gap-1">
                              <Flag size={14} />
                              <span className={getPriorityTextColor(task.priority)}>{task.priority || "None"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <CalendarIcon size={40} className="mb-2 opacity-30" />
                  <p>No tasks scheduled for this date</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}

export default CalendarWithTasks
