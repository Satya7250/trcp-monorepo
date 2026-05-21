"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import { useFormByFormId } from "~/hooks/api/form"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Spinner } from "~/components/ui/spinner"
import { Switch } from "~/components/ui/switch"

type FieldType = "TEXT" | "NUMBER" | "EMAIL" | "YES_NO" | "PASSWORD"

type PublicField = {
  id: string
  label: string
  labelKey: string
  description: string | null
  placeholder: string | null
  isRequired: boolean
  type: FieldType
}

function FormFieldInput({
  field,
  value,
  onChange,
}: {
  field: PublicField
  value: string | boolean
  onChange: (value: string | boolean) => void
}) {
  const id = field.labelKey

  if (field.type === "YES_NO") {
    return (
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div className="space-y-0.5">
          <Label htmlFor={id}>{field.label}</Label>
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
        </div>
        <Switch
          id={id}
          checked={value === true || value === "true"}
          onCheckedChange={onChange}
        />
      </div>
    )
  }

  const inputType =
    field.type === "NUMBER"
      ? "number"
      : field.type === "EMAIL"
        ? "email"
        : field.type === "PASSWORD"
          ? "password"
          : "text"

  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>
        {field.label}
        {field.isRequired && <span className="text-destructive ml-1">*</span>}
      </Label>
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      <Input
        id={id}
        name={id}
        type={inputType}
        placeholder={field.placeholder ?? undefined}
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(e.target.value)}
        required={field.isRequired}
      />
    </div>
  )
}

export default function PublicFormPage() {
  const params = useParams()
  const formId = params.formId as string

  const { form, isLoading, error } = useFormByFormId(formId)
  const [values, setValues] = useState<Record<string, string | boolean>>({})

  const setFieldValue = (labelKey: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [labelKey]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!form) return

    const missing = form.fields.filter(
      (field) =>
        field.isRequired &&
        (values[field.labelKey] === undefined ||
          values[field.labelKey] === "" ||
          values[field.labelKey] === false)
    )

    if (missing.length > 0) {
      toast.error(`Please fill in: ${missing.map((f) => f.label).join(", ")}`)
      return
    }

    toast.success("Form submitted (submission API not wired yet)")
    console.log("Form values:", values)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6">
        <h1 className="text-2xl font-bold">Form not found</h1>
        <p className="text-muted-foreground text-center text-sm">
          This link may be invalid or the form was removed.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-svh bg-muted/30 px-4 py-10">
      <div className="mx-auto w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{form.title}</CardTitle>
            {form.description && (
              <CardDescription>{form.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.length > 0 ? (
                form.fields.map((field) => (
                  <FormFieldInput
                    key={field.id}
                    field={field as PublicField}
                    value={values[field.labelKey] ?? (field.type === "YES_NO" ? false : "")}
                    onChange={(value) => setFieldValue(field.labelKey, value)}
                  />
                ))
              ) : (
                <p className="text-center text-sm text-muted-foreground py-8">
                  This form has no fields yet.
                </p>
              )}

              {form.fields.length > 0 && (
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
