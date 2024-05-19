// "use server";

// import { db } from "~/db";
// import { EmailTemplate, sendMail } from "~/lib/email";

// import { generateEmailVerificationCode } from ".";

// export async function sendEmailVerificationCode(email: string) {
//   const existingVerificationCode =
//     await db.query.emailVerificationCodes.findFirst({
//       where: (table, { eq, and, gt }) =>
//         and(eq(table.email, email), gt(table.expiresAt, new Date())),
//     });

//   if (!existingVerificationCode) {
//     const code = await generateEmailVerificationCode(email);
//     await sendMail(email, EmailTemplate.EmailVerification, { code });
//   }
// }
