// "use client";

// import React from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "sonner";

// import { Form, FormControl, FormField, FormItem } from "~/components/ui/form";
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from "~/components/ui/input-otp";
// import { useAction } from "next-safe-action/hooks";
// import { verifyEmail, resendEmailVerificationCode } from "~/lib/auth/actions";
// import { Button } from "~/components/ui/button";
// import { useForm } from "react-hook-form";
// import { type OTPInput as TOTPInput } from "~/types";
// import { otpSchema } from "~/schemas";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "~/components/ui/alert-dialog";
// import Link from "next/link";
// import { Paths } from "~/lib/constants";
// import { Icons } from "~/components/icons";

// export const VerifyCode = ({ email }: { email: string }) => {
//   const [open, setOpen] = React.useState(false);

//   const form = useForm<TOTPInput>({
//     resolver: zodResolver(otpSchema),
//     defaultValues: {
//       code: "",
//     },
//   });

//   const { execute, result, status, reset } = useAction(verifyEmail, {
//     onSuccess: () => {
//       setOpen(true);
//       form.resetField("code");
//     },
//   });

//   const onSubmit = ({ code }: TOTPInput) => {
//     if (!code) return;
//     execute({
//       email,
//       code,
//     });
//   };

//   const { execute: resendCode } = useAction(resendEmailVerificationCode, {
//     onSuccess: () => {
//       toast.success("A new verification code has been sent to your email");
//     },
//     onError: (error) => {
//       toast.error(error.serverError);
//     },
//   });

//   return (
//     <div className="flex flex-col items-center justify-center space-y-2">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//           <FormField
//             control={form.control}
//             name="code"
//             render={({ field }) => (
//               <FormItem>
//                 <FormControl>
//                   <InputOTP
//                     maxLength={6}
//                     {...field}
//                     onChange={(value) => {
//                       field.onChange(value);
//                       if (form.formState.errors) reset();
//                     }}
//                     onComplete={form.handleSubmit(onSubmit)}
//                   >
//                     <InputOTPGroup>
//                       <InputOTPSlot
//                         index={0}
//                         className="size-12 text-lg font-medium"
//                       />
//                       <InputOTPSlot
//                         index={1}
//                         className="size-12 text-lg font-medium"
//                       />
//                       <InputOTPSlot
//                         index={2}
//                         className="size-12 text-lg font-medium"
//                       />
//                       <InputOTPSlot
//                         index={3}
//                         className="size-12 text-lg font-medium"
//                       />
//                       <InputOTPSlot
//                         index={4}
//                         className="size-12 text-lg font-medium"
//                       />
//                       <InputOTPSlot
//                         index={5}
//                         className="size-12 text-lg font-medium"
//                       />
//                     </InputOTPGroup>
//                   </InputOTP>
//                 </FormControl>
//               </FormItem>
//             )}
//           />
//           <div className="flex flex-col space-y-2">
//             {status === "hasErrored" ? (
//               <p className="rounded-lg border border-destructive/50 bg-destructive/10 p-2 text-center text-[0.8rem] font-medium text-destructive">
//                 {result.serverError}
//               </p>
//             ) : null}
//             <Button
//               type="submit"
//               loading={status === "executing"}
//               loadingText="Verifying code"
//               disabled={status === "executing"}
//               className="w-full"
//             >
//               Verify
//             </Button>
//           </div>
//         </form>
//       </Form>
//       <div className="flex items-center justify-center pb-4">
//         <span className="text-sm">Didn&apos;t receive code?</span>
//         <Button
//           type="button"
//           variant="link"
//           className="px-1 font-medium"
//           onClick={() => resendCode({ email })}
//         >
//           Resend code
//         </Button>
//       </div>
//       <AlertDialog open={open} onOpenChange={setOpen}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle className="inline-flex items-center justify-center sm:justify-start">
//               Your email has been verified
//               <Icons.badgeCheckSolid className="ml-1 size-4 text-blue-500" />
//             </AlertDialogTitle>
//             <AlertDialogDescription>
//               Please, sign in to continue.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <Link href={Paths.SignIn}>
//               <AlertDialogAction className="w-full sm:w-max">
//                 Sign in
//               </AlertDialogAction>
//             </Link>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };
