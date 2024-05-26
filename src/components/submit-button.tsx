"use client";

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "~/components/ui/button";

const SubmitButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & { loadingText?: string }
>(({ className, children, loadingText, ...props }) => {
  const { pending } = useFormStatus();
  return (
    <Button
      {...props}
      type="submit"
      loading={pending}
      loadingText={loadingText}
      className={className}
    >
      {children}
    </Button>
  );
});
SubmitButton.displayName = "SubmitButton";

export { SubmitButton };
