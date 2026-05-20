"use client"

import { useState } from "react"
import { PlusIcon } from "lucide-react"
import { toast } from "sonner"
import { useCreateForm } from "~/hooks/api/form"
import { Button } from "~/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"

export default function FormsPage() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  
  const { createFormAsync, isPending } = useCreateForm()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!title) {
      toast.error("Title is required")
      return
    }

    try {
      await createFormAsync({
        title,
        description: description || undefined,
      })
      
      toast.success("Form created successfully")
      setOpen(false)
      setTitle("")
      setDescription("")
    } catch (error) {
      toast.error("Failed to create form")
      console.error(error)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Forms</h1>
          <p className="text-muted-foreground">Create and manage your forms here.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 size-4" />
              Create Form
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create New Form</DialogTitle>
                <DialogDescription>
                  Give your form a title and description to get started.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter form title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what this form is for"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Form"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground">No forms found. Create your first form above.</p>
      </div>
    </div>
  )
}
