"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { 
  PlusIcon, 
  Trash2Icon, 
  ChevronLeftIcon,
  Settings2Icon,
  GripVerticalIcon
} from "lucide-react"
import { toast } from "sonner"
import { useForm } from "~/hooks/api/form"
import { 
  useFormFields, 
  useCreateField, 
  useDeleteField, 
  useUpdateField 
} from "~/hooks/api/form-field"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Switch } from "~/components/ui/switch"
import { Spinner } from "~/components/ui/spinner"
import Link from "next/link"

const FIELD_TYPES = [
  { label: "Text", value: "TEXT" },
  { label: "Number", value: "NUMBER" },
  { label: "Email", value: "EMAIL" },
  { label: "Yes/No", value: "YES_NO" },
  { label: "Password", value: "PASSWORD" },
]

export default function FormBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const formId = params.id as string

  const { form, isLoading: isLoadingForm } = useForm(formId)
  const { fields, isLoading: isLoadingFields } = useFormFields(formId)
  
  const { createFieldAsync, isPending: isCreating } = useCreateField()
  const { deleteFieldAsync } = useDeleteField()
  const { updateFieldAsync } = useUpdateField()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newField, setNewField] = useState({
    label: "",
    type: "TEXT",
    description: "",
    placeholder: "",
    isRequired: false,
  })

  const handleAddField = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newField.label) return

    try {
      await createFieldAsync({
        formId,
        label: newField.label,
        type: newField.type as any,
        description: newField.description || undefined,
        placeholder: newField.placeholder || undefined,
        isRequired: newField.isRequired,
      })
      toast.success("Field added successfully")
      setIsModalOpen(false)
      setNewField({
        label: "",
        type: "TEXT",
        description: "",
        placeholder: "",
        isRequired: false,
      })
    } catch (error) {
      toast.error("Failed to add field")
    }
  }

  const handleDeleteField = async (id: string) => {
    try {
      await deleteFieldAsync(id)
      toast.success("Field deleted")
    } catch (error) {
      toast.error("Failed to delete field")
    }
  }

  if (isLoadingForm || isLoadingFields) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">Form not found</h1>
        <Button onClick={() => router.push("/dashboard/forms")}>Back to Forms</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/forms">
              <ChevronLeftIcon className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{form.title}</h1>
            <p className="text-sm text-muted-foreground">{form.description || "Form Builder"}</p>
          </div>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="mr-2 size-4" />
              Add Field
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleAddField}>
              <DialogHeader>
                <DialogTitle>Add New Field</DialogTitle>
                <DialogDescription>
                  Define the properties of your new form field.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="label">Label</Label>
                  <Input
                    id="label"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="e.g. Your Email"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label>Type</Label>
                  <Select 
                    value={newField.type} 
                    onValueChange={(val) => setNewField({ ...newField, type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {FIELD_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="placeholder">Placeholder (Optional)</Label>
                  <Input
                    id="placeholder"
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="e.g. email@example.com"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="required">Required Field</Label>
                  <Switch
                    id="required"
                    checked={newField.isRequired}
                    onCheckedChange={(val) => setNewField({ ...newField, isRequired: val })}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isCreating}>
                  {isCreating ? "Adding..." : "Add Field"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="max-w-2xl mx-auto space-y-4">
        {fields && fields.length > 0 ? (
          fields.map((field) => (
            <Card key={field.id} className="group relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVerticalIcon className="size-4 text-muted-foreground" />
              </div>
              <CardHeader className="flex flex-row items-center justify-between py-4 pl-8">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-medium">{field.label}</CardTitle>
                    {field.isRequired && <span className="text-destructive text-xs">*Required</span>}
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded uppercase font-bold text-muted-foreground">
                      {field.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">Key: {field.labelKey}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2Icon className="size-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon-sm" 
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleDeleteField(field.id)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-muted-foreground">No fields added yet. Click "Add Field" to start building your form.</p>
          </div>
        )}
      </div>
    </div>
  )
}
