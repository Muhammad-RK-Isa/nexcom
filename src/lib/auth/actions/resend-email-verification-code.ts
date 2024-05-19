// "use server";

// import { unstable_noStore as noStore } from "next/cache";

// import { db } from "~/db";
// import { EmailTemplate, sendMail } from "~/lib/email";

// import { action } from "~/lib/actions/safe-action";
// import { resendEmailVerificationCodeSchema } from "~/schemas";

// import { generateEmailVerificationCode } from ".";

// export const resendEmailVerificationCode = action(
//   resendEmailVerificationCodeSchema,
//   async ({ email }) => {
//     noStore();
//     try {
//       const existingVerificationCode =
//         await db.query.emailVerificationCodes.findFirst({
//           where: (table, { eq, and }) => and(eq(table.email, email)),
//         });

//       const currentTime = new Date().getTime();

//       if (
//         existingVerificationCode &&
//         existingVerificationCode.expiresAt.getTime() > currentTime
//       ) {
//         const waitTime = new Date(
//           existingVerificationCode.expiresAt.getTime() - currentTime,
//         );
//         const minutes = new Date(waitTime).getMinutes();
//         const seconds = new Date(waitTime).getSeconds();
//         throw new Error(
//           `Please wait ${minutes ? minutes + " min" : 0} ${seconds ? seconds + " sec" : 0} before requesting another code!`,
//         );
//       }

//       const code = await generateEmailVerificationCode(email);
//       await sendMail(email, EmailTemplate.EmailVerification, { code });
//     } catch (error) {
//       throw error;
//     }
//   },
// );
