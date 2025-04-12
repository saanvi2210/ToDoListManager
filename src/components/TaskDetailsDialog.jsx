// components/TaskDetailsDialog.tsx
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// type Props = {
//   open: boolean
//   onOpenChange: (open: boolean) => void
//   setPriority: (priority: string) => void
//   setDueDate: (dueDate: string) => void
//   onConfirm: () => void
// }

export default function TaskDetailsDialog({
  open,
  onOpenChange,
  setPriority,
  setDueDate,
  onConfirm
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Task Details</DialogTitle>
        </DialogHeader>

        {/* Priority Selection */}
        <Select onValueChange={(value) => setPriority(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        {/* Due Date */}
        <Input
          type="datetime-local"
          className="mt-2"
          onChange={(e) => setDueDate(e.target.value)}
        />

        <DialogFooter>
          <Button onClick={onConfirm}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
