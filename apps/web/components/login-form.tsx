"use client"

import { useForm, SubmitHandler } from "react-hook-form"
import { useRouter } from "next/navigation"
import { useSignIn } from "~/hooks/api/auth"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { toast } from "sonner"
import Link from "next/link"

interface LoginFormInputs {
  email: string
  password: string
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const { signInWithEmailAndPasswordAsync, status } = useSignIn()
  const isSubmitting = status === "pending"
  const router = useRouter();
  const { register, handleSubmit } = useForm<LoginFormInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    try {
      await signInWithEmailAndPasswordAsync({
        email: data.email,
        password: data.password
      });
      toast.success("Login successful")
      router.replace(`/dashboard`)
    } catch (error: any) {
      console.error("Login Error:", error)
      toast.error(error.message || "Invalid email or password")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  disabled={isSubmitting}
                  {...register("email", { required: "Email is required" })}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  disabled={isSubmitting}
                  {...register("password", { required: "Password is required" })}
                />
              </Field>
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Logging in..." : "Login"}
                </Button>
                <Button variant="outline" type="button" disabled={isSubmitting}>
                  Login with Google
                </Button>
                <FieldDescription className="text-center">
                  Don&apos;t have an account? <Link href="/signup" className="underline underline-offset-4">Sign up</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

