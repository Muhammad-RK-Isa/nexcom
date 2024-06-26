import "server-only"

import type { ComponentProps } from "react"
import { render } from "@react-email/render"
import { createTransport, type TransportOptions } from "nodemailer"

import { EMAIL_SENDER } from "~/lib/constants"
import { env } from "~/env"

import { EmailVerificationEmail } from "../../components/emails/email-verification"
import { ResetPasswordTemplate } from "../../components/emails/reset-password"

export enum EmailTemplate {
  EmailVerification = "EmailVerification",
  PasswordReset = "PasswordReset",
}

export type PropsMap = {
  [EmailTemplate.EmailVerification]: ComponentProps<
    typeof EmailVerificationEmail
  >
  [EmailTemplate.PasswordReset]: ComponentProps<typeof ResetPasswordTemplate>
}

const getEmailTemplate = <T extends EmailTemplate>(
  template: T,
  props: PropsMap[NoInfer<T>]
) => {
  switch (template) {
    case EmailTemplate.EmailVerification:
      return {
        subject: "Verify your email address",
        body: render(
          <EmailVerificationEmail
            {...(props as PropsMap[EmailTemplate.EmailVerification])}
          />
        ),
      }
    case EmailTemplate.PasswordReset:
      return {
        subject: "Reset your password",
        body: render(
          <ResetPasswordTemplate
            {...(props as PropsMap[EmailTemplate.PasswordReset])}
          />
        ),
      }
    default:
      throw new Error("Invalid email template")
  }
}

const smtpConfig = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
}

const transporter = createTransport(smtpConfig as TransportOptions)

export const sendMail = async <T extends EmailTemplate>(
  to: string,
  template: T,
  props: PropsMap[NoInfer<T>]
) => {
  if (env.NODE_ENV !== "production") {
    console.log(
      "📨 Email sent to:",
      to,
      "with template:",
      template,
      "and props:",
      props
    )
    return
  }

  const { subject, body } = getEmailTemplate(template, props)

  return transporter.sendMail({ from: EMAIL_SENDER, to, subject, html: body })
}
