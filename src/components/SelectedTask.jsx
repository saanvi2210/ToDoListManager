"use client"

import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal,  useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Flag, CheckCircle2, Circle, MoreHorizontal, Edit, Trash2, Plus, Save, X } from "lucide-react"
import { useTask } from "../context/taskContext"
import { deleteTask,  updateTask, addSubTask, deleteSubtask, updateSubtask } from "../firebase/firebaseHelpers"
import TaskDetailsDialog from "./TaskDetailsDialog"
import { useAuth } from '../hooks/useAuth'

const SelectedTask = () => {
    const { user } = useAuth()
    const { selectedTask, setSelectedTask } = useTask()
   
    const [showTaskDetailsDialog, setShowTaskDetailsDialog] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const [newSubtaskText, setNewSubtaskText] = useState("")
    const [editingSubtaskId, setEditingSubtaskId] = useState(null)
    const [editingSubtaskText, setEditingSubtaskText] = useState("")

    // If no task is selected, show empty state
    if (!selectedTask) {
        return (
            <div className="min-h-screen p-6 md:p-8 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-20 left-10 w-64 h-64 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-20 right-10 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                </div>

                <div className="max-w-6xl mx-auto z-10 relative">
                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100 mb-8 w-full max-w-3xl flex flex-col items-center justify-center"
                            style={{ minHeight: "300px" }}
                        >
                            <p className="text-gray-500 text-lg">Select a task to view details</p>
                        </motion.div>
                    </div>
                </div>
            </div>
        )
    }

    // Safely calculate days remaining if dueDate exists
    let daysRemaining = null
    if (selectedTask.dueDate) {
        const dueDate = new Date(selectedTask.dueDate)
        const today = new Date()
        daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    }

    // Priority color mapping
    const priorityColors = {
        low: "bg-blue-100 text-blue-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-red-100 text-red-800",
    }

    // Normalize priority to lowercase for consistent mapping
    const normalizedPriority = selectedTask.priority?.toLowerCase() ;


    // Handle task deletion
    const handleDeleteTask = async () => {
        console.log(selectedTask.id)
        await deleteTask(user, selectedTask.id)
        console.log("task deleeted")
        setSelectedTask(null)

    }

    // Handle task editing
    // const handleEditTask = () => {
    //     setIsEditing(true)
    //     setEditedText(selectedTask.text || "")
    // }



    // Handle task details update
    const handleUpdateTaskDetails = async (updatedDetails) => {
        console.log(updatedDetails)
        await updateTask(user, selectedTask.id, updatedDetails)
        console.log("updated details")
        setSelectedTask({ ...selectedTask, ...updatedDetails })
        setShowTaskDetailsDialog(false)
    }

    // Handle adding a subtask
    const handleAddSubtask = async () => {
        if (!newSubtaskText.trim()) return

        const newSubtask = {
            text: newSubtaskText,
            completed: false,
            id: Date.now().toString(), // Temporary ID until Firebase assigns one
        }

        // Add to Firebase
        await addSubTask(user, selectedTask.id, newSubtask)

        // Update local state
        const updatedSubtasks = [...(selectedTask.subtasks || []), newSubtask]
        setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks })
        setNewSubtaskText("")
    }

    // Handle toggling subtask completion
    const handleToggleSubtask = async (subtaskId) => {
        const subtasks = [...(selectedTask.subtasks || [])]
        const subtaskIndex = subtasks.findIndex((st) => st.id === subtaskId)

        if (subtaskIndex !== -1) {
            const updatedSubtask = { ...subtasks[subtaskIndex], completed: !subtasks[subtaskIndex].completed }
            subtasks[subtaskIndex] = updatedSubtask

            // Update in Firebase
            await updateSubtask(selectedTask.id, subtaskId, updatedSubtask)

            // Update local state
            setSelectedTask({ ...selectedTask, subtasks })
        }
    }

    // Handle deleting a subtask
    const handleDeleteSubtask = async (subtaskId) => {
        console.log(subtaskId)
        // Delete from Firebase
        await deleteSubtask(user, selectedTask.id, subtaskId)

        // Update local state
        const updatedSubtasks = (selectedTask.subtasks || []).filter((st) => st.id !== subtaskId)
        setSelectedTask({ ...selectedTask, subtasks: updatedSubtasks })
    }

    // Handle editing a subtask
    const handleEditSubtask = (subtask) => {
        setEditingSubtaskId(subtask.id)
        setEditingSubtaskText(subtask.text)
    }

    // Handle saving subtask edit
    const handleSaveSubtaskEdit = async (subtaskId) => {
        if (!editingSubtaskText.trim()) return

        const subtasks = [...(selectedTask.subtasks || [])]
        const subtaskIndex = subtasks.findIndex((st) => st.id === subtaskId)

        if (subtaskIndex !== -1) {
            const updatedSubtask = { ...subtasks[subtaskIndex], text: editingSubtaskText }
            subtasks[subtaskIndex] = updatedSubtask

            // Update in Firebase
            await updateSubtask(user, selectedTask.id, subtaskId, editingSubtaskText)

            // Update local state
            setSelectedTask({ ...selectedTask, subtasks })
            setEditingSubtaskId(null)
            setEditingSubtaskText("")
        }
    }

    return (
        <div className="min-h-screen p-6 md:p-8 relative overflow-hidden">
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
                        {/* Task Header with Actions */}
                        <div className="flex justify-between items-start mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">{selectedTask.title || "Untitled Task"}</h1>
                            <div className="relative">
                                <button className="text-gray-500 hover:text-gray-700" onClick={() => setShowDropdown(!showDropdown)}>
                                    <MoreHorizontal className="h-5 w-5" />
                                </button>

                                {/* Dropdown menu */}
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-100">
                                        <div className="py-1">
                                            <button
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => {
                                                    setShowDropdown(false)
                                                    setShowTaskDetailsDialog(true)
                                                }}
                                            >
                                                <Edit className="h-4 w-4 mr-2" />
                                                Edit Details
                                            </button>
                                            <button
                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                                onClick={() => {
                                                    setShowDropdown(false)
                                                    handleDeleteTask()
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Task
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>


                        <div className="mb-6 group relative">
                            <p className="text-gray-600">{selectedTask.text || "No description provided."}</p>
                            {/* <button
                                onClick={handleEditTask}
                                className="absolute top-0 right-0 p-1 text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            >

                            </button> */}
                        </div>


                        {/* Task Metadata */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            {selectedTask.dueDate && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Calendar className="h-5 w-5 text-blue-500" />
                                    <span className="text-sm">
                                        Due:{" "}
                                        {new Date(selectedTask.dueDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                    {daysRemaining !== null && (
                                        <span
                                            className={`ml-2 text-xs px-2 py-1 rounded-full ${daysRemaining <= 3 ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"}`}
                                        >
                                            {daysRemaining > 0 ? `${daysRemaining} days left` : "Overdue"}
                                        </span>
                                    )}
                                </div>
                            )}

                            {selectedTask.priority && (
                                <div className="flex items-center gap-2 text-gray-700">
                                    <Flag
                                        className={`h-5 w-5 ${normalizedPriority === "high"
                                                ? "text-red-500"
                                                : normalizedPriority === "medium"
                                                    ? "text-yellow-500"
                                                    : "text-blue-500"
                                            }`}
                                    />
                                    <span className="text-sm">Priority:</span>
                                    <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[normalizedPriority]}`}>
                                        {selectedTask.priority}
                                    </span>
                                </div>
                            )}
                        </div>

                        {Array.isArray(selectedTask.subtasks) && selectedTask.subtasks.length > 0 && (
                            <div className="mb-8">
                                {(() => {
                                    const completed = selectedTask.subtasks.filter((s) => s.completed).length;
                                    const total = selectedTask.subtasks.length;
                                    const progress = Math.round((completed / total) * 100);

                                    return (
                                        <>
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                                <span className="text-sm font-medium text-gray-700">{progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                                                    style={{ width: `${progress}%` }}
                                                ></div>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>
                        )}


                        {/* Subtasks Section */}
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Subtasks{" "}
                                    {selectedTask.subtasks && Array.isArray(selectedTask.subtasks) && (
                                        <>
                                            ({selectedTask.subtasks.filter((st) => st.completed).length}/{selectedTask.subtasks.length})
                                        </>
                                    )}
                                </h2>
                            </div>

                            {/* Add Subtask Input */}
                            <div className="flex items-center mb-4">
                                <input
                                    type="text"
                                    value={newSubtaskText}
                                    onChange={(e) => setNewSubtaskText(e.target.value)}
                                    placeholder="Add a subtask..."
                                    className="flex-1 px-3 py-2 border border-blue-200 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
                                    onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                                />
                                <button
                                    onClick={handleAddSubtask}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-r-lg hover:bg-blue-600"
                                >
                                    <Plus className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Subtasks List */}
                            <div className="space-y-3">
                                {selectedTask.subtasks && Array.isArray(selectedTask.subtasks) && selectedTask.subtasks.length > 0 ? (
                                    selectedTask.subtasks.map((subtask) => (
                                        <motion.div
                                            key={subtask.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 group"
                                        >
                                            {/* Checkbox */}
                                            <button onClick={() => handleToggleSubtask(subtask.id)}>
                                                {subtask.completed ? (
                                                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                ) : (
                                                    <Circle className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                                )}
                                            </button>

                                            {/* Subtask Text or Edit Input */}
                                            {editingSubtaskId === subtask.id ? (
                                                <div className="flex-1 flex items-center">
                                                    <input
                                                        type="text"
                                                        value={editingSubtaskText}
                                                        onChange={(e) => setEditingSubtaskText(e.target.value)}
                                                        className="flex-1 px-2 py-1 border border-blue-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
                                                        autoFocus
                                                        onKeyPress={(e) => e.key === "Enter" && handleSaveSubtaskEdit(subtask.id)}
                                                    />
                                                    <button
                                                        onClick={() => handleSaveSubtaskEdit(subtask.id)}
                                                        className="ml-2 p-1 text-green-500 hover:text-green-600"
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setEditingSubtaskId(null)}
                                                        className="ml-1 p-1 text-gray-500 hover:text-gray-600"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span
                                                    className={`flex-1 ${subtask.completed ? "text-gray-500 line-through" : "text-gray-700"}`}
                                                >
                                                    {subtask.text}
                                                </span>
                                            )}

                                            {/* Action Buttons (visible on hover) */}
                                            {editingSubtaskId !== subtask.id && (
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                                                    <button
                                                        onClick={() => handleEditSubtask(subtask)}
                                                        className="p-1 text-blue-500 hover:text-blue-600"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteSubtask(subtask.id)}
                                                        className="p-1 text-red-500 hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-sm italic">No subtasks yet. Add one above.</p>
                                )}
                            </div>
                        </div>

                        {/* Tags - Only show if tags exist and is an array */}
                        {selectedTask.tags && Array.isArray(selectedTask.tags) && selectedTask.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {selectedTask.tags.map((tag) => (
                                    <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Created At - Show creation date if available */}
                        {selectedTask.createdAt && (
                            <div className="text-xs text-gray-500 mt-4">
                                Created:{" "}
                                {typeof selectedTask.createdAt === "string"
                                    ? selectedTask.createdAt
                                    : new Date(selectedTask.createdAt).toLocaleString()}
                            </div>
                        )}

                        {/* Completion Status */}
                        <div className="mt-4 flex items-center">
                            <span
                                className={`text-xs px-2 py-1 rounded-full ${selectedTask.completed ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                                    }`}
                            >
                                {selectedTask.completed ? "Completed" : "In Progress"}
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Task Details Dialog for editing task details */}
            {showTaskDetailsDialog && (
                <TaskDetailsDialog
                    type="edit"
                    input=""
                    open={showTaskDetailsDialog}
                    onOpenChange={setShowTaskDetailsDialog}
                    initialTask={selectedTask}
                    onConfirm={handleUpdateTaskDetails}
                />
            )}
        </div>
    )
}

export default SelectedTask
