// components/TaskDetailsDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


export default function TaskDetailsDialog({
  type,
  input,
  setInput,
  open,
  onOpenChange,
  setPriority,
  setDueDate,
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type == 'main' ? 'Set Task Details' : 'Set subtask Details'}</DialogTitle>
        </DialogHeader>

        {/* Task Title Input */}
        <Input
          placeholder={type == 'main' ? 'Task title' : 'Subtask title'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Priority Selection */}
        <Select onValueChange={(value) => setPriority(value)}>
          <SelectTrigger className="w-full mt-2">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
{
  type == 'main' ?  <Input
  type="datetime-local"
  className="mt-2"
  onChange={(e) => setDueDate(e.target.value)}
/> : ''
}
        {/* Due Date Input */}
       

        <DialogFooter>
          <Button onClick={onConfirm}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
