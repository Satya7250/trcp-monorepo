"use client"

import { useState } from "react"
import { PlusIcon, FileTextIcon, ExternalLinkIcon } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useCreateForm, useMyForms } from "~/hooks/api/form"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Spinner } from "~/components/ui/spinner"

export default function FormsPage() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  
  const { createFormAsync, isPending } = useCreateForm()
  const { forms, isLoading } = useMyForms()

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
      
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner className="size-8" />
        </div>
      ) : forms && forms.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Created At</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="font-medium">
                    <Link 
                      href={`/dashboard/forms/${form.id}`}
                      className="flex items-center gap-2 hover:underline text-primary"
                    >
                      <FileTextIcon className="size-4" />
                      {form.title}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <span className="line-clamp-1 text-muted-foreground">
                      {form.description || "No description"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {form.createdAt ? new Date(form.createdAt).toLocaleDateString() : 'recently'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/dashboard/forms/${form.id}`}>
                        <ExternalLinkIcon className="mr-2 size-4" />
                        Build
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-muted">
            <FileTextIcon className="size-6 text-muted-foreground" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">No forms found</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven't created any forms yet. Click the button above to create your first one.
          </p>
        </div>
      )}
    </div>
  )
}
