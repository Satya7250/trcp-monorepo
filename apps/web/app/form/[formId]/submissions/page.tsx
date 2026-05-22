import { redirect } from "next/navigation"

type PageProps = {
  params: Promise<{ formId: string }>
}

export default async function FormSubmissionsRedirectPage({ params }: PageProps) {
  const { formId } = await params
  redirect(`/dashboard/forms/${formId}/submissions`)
}
