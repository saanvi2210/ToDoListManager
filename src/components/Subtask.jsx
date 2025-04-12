import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { motion } from 'framer-motion'
import TaskDetailsDialog from './TaskDetailsDialog';
import { addSubTask } from '../firebase/firebaseHelpers';

const SubtaskManager = ({ task }) => {

    const [input, setInput] = useState("")
    const [priority, setPriority] = useState("")
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

    
    
      const handleConfirmDetails = async () => {

        await addSubTask(task,input, priority)
        setInput("")
        setPriority("")
        setShowDetailsDialog(false)
      }
    const handleAddSubtask = ()=>{
        setShowDetailsDialog(true)
    }



    return (
        <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="text-blue-500 hidden group-hover:block cursor-pointer"
            onClick={handleAddSubtask}
        >
            <Plus />
            <TaskDetailsDialog
            type='sub'
                            input ={input}
                            setInput={setInput}
                          open={showDetailsDialog}
                          onOpenChange={setShowDetailsDialog}
                          setPriority={setPriority}
                          onConfirm={handleConfirmDetails}
                        />
        </motion.button>
        // <div className="mt-2">
        //   <button
        //     onClick={() => setCollapsed(!collapsed)}
        //     className="text-xs text-blue-500 underline mb-1"
        //   >
        //     {collapsed ? 'Show Subtasks' : 'Hide Subtasks'}
        //   </button>

        //   {!collapsed && (
        //     <>
        //       {(task.subtasks || []).map((sub, index) => (
        //         <div
        //           key={sub.id}
        //           className="flex items-center justify-between gap-2 text-sm p-1 pl-3 border rounded mb-1"
        //         >
        //           <div className="flex items-center gap-2">
        //             <button onClick={() => handleToggleComplete(sub.id)}>
        //               <input type="checkbox" checked={sub.completed} readOnly />
        //             </button>
        //             <span className={sub.completed ? 'line-through text-gray-500' : ''}>
        //               {sub.text}
        //             </span>
        //           </div>
        //           <div className="flex items-center gap-2">
        //             <button onClick={() => handleDeleteSubtask(sub.id)}>
        //               <Trash2 size={14} className="text-red-500" />
        //             </button>
        //             <GripVertical size={14} className="cursor-move text-gray-400" />
        //           </div>
        //         </div>
        //       ))}

        //       {/* Add New Subtask */}
        //       <div className="flex gap-2 mt-2">
        //         <input
        //           type="text"
        //           value={newSubtaskText}
        //           onChange={(e) => setNewSubtaskText(e.target.value)}
        //           className="flex-1 border px-2 py-1 rounded text-sm"
        //           placeholder="New subtask"
        //         />
        //         <button
        //           onClick={handleAddSubtask}
        //           className="bg-blue-500 text-white px-2 py-1 rounded"
        //         >
        //           <Plus size={14} />
        //         </button>
        //       </div>
        //     </>
        //   )}
        // </div>
    );
};

export default SubtaskManager;
