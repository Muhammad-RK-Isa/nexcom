"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter } from "next-nprogress-bar";

import { Icons } from "~/components/icons";
import { AnimatedInput } from "~/components/ui/animated-input";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { DEFAULT_LOGIN_REDIRECT } from "~/routes";
import { createUserSchema } from "~/server/db/schema";
import type { CreateUserInput } from "~/types";
import { api } from "~/trpc/react";
import { Paths } from "~/lib/constants";
import { toast } from "sonner";

export const SignUpForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const callbackUrl = decodeURIComponent(
    searchParams.get("callbackUrl") ?? DEFAULT_LOGIN_REDIRECT,
  );

  const [showPassword, setShowPassword] = React.useState(false);

  const form = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  const createUser = api.users.create.useMutation();

  const onSubmit = async (values: CreateUserInput) => {
    await createUser.mutateAsync(
      { ...values },
      {
        onSuccess: () => {
          toast.success("Account created. Please, sign in to continue.");
          router.push(Paths.SignIn);
        },
      },
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <AnimatedInput {...field} placeholder="Michael Bubalula" />
              </FormControl>
            </FormItem>
          )}
        />
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
                    field.onChange(value);
                    if (createUser.status === "error") createUser.reset();
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
        <FormField
          name="confirm"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <AnimatedInput
                    {...field}
                    placeholder="••••••••"
                    type={showPassword ? "text" : "password"}
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
        {createUser.isError || Object.keys(form.formState.errors).length > 0 ? (
          <ul className="list-disc space-y-1 rounded-lg border border-destructive/20 bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
            {form.formState.errors ? (
              <>
                {Object.values(form.formState.errors).map(
                  ({ message }, idx) => (
                    <li className="ml-4" key={idx}>
                      {message}
                    </li>
                  ),
                )}
              </>
            ) : null}
            {createUser.isError ? (
              <li className="ml-4">{createUser.error.message}</li>
            ) : null}
          </ul>
        ) : null}
        <div className="mt-5 inline-flex items-center gap-1 text-sm">
          <span className="text-muted-foreground">Have an account?</span>
          <Link
            href={`/signin?callbackUrl=${callbackUrl}`}
            className="font-medium underline-offset-2 hover:underline"
          >
            Sign in
          </Link>
        </div>
        <button
          className="group/btn relative flex h-10 w-full items-center justify-center rounded-md bg-primary text-sm font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:bg-gradient-to-br dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={createUser.isPending}
        >
          {createUser.isPending ? (
            <>
              <Icons.spinner className="mr-2 size-5" />
              <span>Creating account</span>
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
          onClick={() => signIn("google", { redirect: true, callbackUrl })}
        >
          <Icons.google className="size-4 text-primary/80" />
          <span className="text-sm">Continue with Google</span>
          <BottomGradient />
        </button>
      </form>
    </Form>
  );
};

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};
