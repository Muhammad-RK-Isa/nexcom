// "use server";

// import { eq } from "drizzle-orm";
// import crypto from "node:crypto";

// import { db } from "~/server/db";
// import { emailVerificationCodes } from "~/server/db/schema";

// export async function generateEmailVerificationCode(
//   email: string,
// ): Promise<string> {
//   await db
//     .delete(emailVerificationCodes)
//     .where(eq(emailVerificationCodes.email, email));
//   const code = crypto.randomInt(100000, 999999).toString();
//   const dbCode = await db
//     .insert(emailVerificationCodes)
//     .values({
//       email,
//       code,
//       expiresAt: new Date(new Date().getTime() + 5 * 60 * 1000),
//     })
//     .returning({ code: emailVerificationCodes.code });
//   return dbCode[0].code;
// }
