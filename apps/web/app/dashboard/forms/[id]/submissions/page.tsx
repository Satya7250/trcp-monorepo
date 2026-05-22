"use client"

import { useMemo } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ChevronLeftIcon } from "lucide-react"
import { useForm, useFormSubmissions } from "~/hooks/api/form"
import { useFormFields } from "~/hooks/api/form-field"
import { Button } from "~/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Spinner } from "~/components/ui/spinner"

type FormField = {
  id: string
  label: string
  index: string
  type: string
}

function formatCellValue(value: string, fieldType: string) {
  if (!value) return "—"
  if (fieldType === "YES_NO") return value === "true" ? "Yes" : "No"
  return value
}

function getValueForField(
  values: { formFieldId: string; value: string }[],
  fieldId: string
) {
  return values.find((entry) => entry.formFieldId === fieldId)?.value ?? ""
}

export default function FormSubmissionsPage() {
  const params = useParams()
  const formId = params.id as string

  const { form, isLoading: isLoadingForm, error: formError } = useForm(formId)
  const { fields, isLoading: isLoadingFields, error: fieldsError } = useFormFields(formId)
  const {
    submissions,
    isLoading: isLoadingSubmissions,
    error: submissionsError,
  } = useFormSubmissions(formId)

  const sortedFields = useMemo(() => {
    if (!fields) return []
    return [...fields].sort(
      (a, b) => parseFloat(a.index) - parseFloat(b.index)
    ) as FormField[]
  }, [fields])

  const isLoading = isLoadingForm || isLoadingFields || isLoadingSubmissions
  const error = formError ?? fieldsError ?? submissionsError

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner className="size-8" />
      </div>
    )
  }

  if (error || !form) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-2xl font-bold">Unable to load submissions</h1>
        <p className="text-muted-foreground text-center text-sm">
          You may not have access to this form, or it does not exist.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard/forms">Back to forms</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/forms/${formId}`}>
              <ChevronLeftIcon className="size-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{form.title}</h1>
            <p className="text-sm text-muted-foreground">Submissions</p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/form/${formId}`} target="_blank">
            Open public form
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Responses</CardTitle>
          <CardDescription>
            {submissions?.length ?? 0} submission
            {(submissions?.length ?? 0) === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedFields.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-12">
              Add fields to your form to see responses in a table.
            </p>
          ) : submissions && submissions.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[160px] whitespace-nowrap">
                      Submitted
                    </TableHead>
                    {sortedFields.map((field) => (
                      <TableHead
                        key={field.id}
                        className="min-w-[140px] whitespace-nowrap"
                      >
                        {field.label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {submission.createdAt
                          ? new Date(submission.createdAt).toLocaleString()
                          : "—"}
                      </TableCell>
                      {sortedFields.map((field) => {
                        const raw = getValueForField(submission.values, field.id)
                        return (
                          <TableCell key={field.id}>
                            {formatCellValue(raw, field.type)}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground py-12">
              No submissions yet. Share your public form link to collect responses.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
