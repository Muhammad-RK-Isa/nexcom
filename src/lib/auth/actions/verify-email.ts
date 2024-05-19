// "use server";

// import { eq } from "drizzle-orm";
// import { unstable_noStore as noStore } from "next/cache";

// import { db } from "~/db";
// import { emailVerificationCodes, users } from "~/db/schema";
// import { action } from "~/lib/actions/safe-action";
// import { verifyEmailSchema } from "~/schemas";

// export const verifyEmail = action(
//   verifyEmailSchema,
//   async ({ email, code }) => {
//     noStore();
//     console.log("Inputs", email, code);
//     try {
//       const dbCode = await db.query.emailVerificationCodes.findFirst({
//         where: (table, { eq, and }) =>
//           and(eq(table.email, email), eq(table.code, code)),
//       });

//       if (!dbCode) throw new Error("Invalid verification code");

//       await db
//         .delete(emailVerificationCodes)
//         .where(eq(emailVerificationCodes.id, dbCode.id));

//       const currentDate = new Date();

//       if (currentDate.getTime() >= dbCode.expiresAt.getTime())
//         throw new Error("Verification code has expired");

//       if (dbCode.email !== email) throw new Error("Email didn't match");

//       await db
//         .update(users)
//         .set({ emailVerified: currentDate })
//         .where(eq(users.email, email));
//     } catch (error) {
//       throw error;
//     }
//   },
// );
