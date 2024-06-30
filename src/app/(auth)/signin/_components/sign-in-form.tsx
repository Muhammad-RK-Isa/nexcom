"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { DEFAULT_LOGIN_REDIRECT } from "~/routes"
import { signInSchema } from "~/server/db/schema"
import { signIn } from "next-auth/react"
import { useRouter } from "next-nprogress-bar"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import type { SignInInput } from "~/types"
import { AnimatedInput } from "~/components/ui/animated-input"
import { Button } from "~/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form"
import { Icons } from "~/components/icons"

export const SignInForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()

  const callbackUrl = decodeURIComponent(
    searchParams.get("callbackUrl") ?? DEFAULT_LOGIN_REDIRECT
  )

  const [showPassword, setShowPassword] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const [error, setError] = React.useState("")

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = (values: SignInInput) => {
    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          ...values,
          redirect: false,
        })
        if (result?.error) {
          setError(result.error)
          return
        }
        router.push(callbackUrl)
      } catch (error) {
        toast.error("Something went wrong!")
      } finally {
        return
      }
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <AnimatedInput
                  {...field}
                  placeholder="email@example.com"
                  type="email"
                  onChange={(value) => {
                    field.onChange(value)
                    setError("")
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <AnimatedInput
                    {...field}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
                    onChange={(value) => {
                      field.onChange(value)
                      setError("")
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <Icons.eyeOff
                        className="size-4 text-muted-foreground transition-all hover:text-primary"
                        aria-hidden="true"
                      />
                    ) : (
                      <Icons.eye
                        className="size-4 text-muted-foreground transition-all hover:text-primary"
                        aria-hidden="true"
                      />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        {error || Object.keys(form.formState.errors).length > 0 ? (
          <ul className="list-disc space-y-1 rounded-lg border border-destructive/20 bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
            {form.formState.errors ? (
              <>
                {Object.values(form.formState.errors).map(
                  ({ message }, idx) => (
                    <li className="ml-4" key={idx}>
                      {message}
                    </li>
                  )
                )}
              </>
            ) : null}
            {error ? <li className="ml-4">{error}</li> : null}
          </ul>
        ) : null}
        <div className="mt-5 flex items-center justify-between text-sm">
          <div className="inline-flex items-center gap-1">
            <span className="text-muted-foreground">No account?</span>
            <Link
              href={`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`}
              className="font-medium underline-offset-2 hover:underline"
            >
              Sign up
            </Link>
          </div>
          <Link
            href={`/reset-password?email=${form.getValues("email")}`}
            className="font-medium underline-offset-2 hover:underline"
          >
            Reset Password
          </Link>
        </div>
        <button
          className="group/btn relative flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Icons.spinner className="mr-2 size-5" />
              <span>Signing you in</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <Icons.moveRight className="ml-2 size-4" />
            </>
          )}
          <BottomGradient />
        </button>

        <div className="my-8 h-px w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

        <button
          className="group/btn relative flex h-10 w-full items-center justify-center space-x-2 rounded-md bg-background px-4 font-medium shadow-input dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
          type="button"
          onClick={() => signIn("google", { redirect: false, callbackUrl })}
        >
          <Icons.google className="size-4 text-primary/80" />
          <span className="text-sm">Continue with Google</span>
          <BottomGradient />
        </button>
      </form>
    </Form>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  )
}
