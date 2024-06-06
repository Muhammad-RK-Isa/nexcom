import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { currentUser } from "~/lib/auth/utils";

const f = createUploadthing();

export const ourFileRouter = {
  authenticatedRoute: f({ image: { maxFileSize: "4MB" } })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthenticated");
      return { user };
    })
    .onUploadComplete(({ file }) => {
      console.log("✅ Upload completed");
      console.log("🔗 File url", file.url);
    }),
  authorizedRoute: f({ image: { maxFileSize: "32MB" } })
    .middleware(async () => {
      const user = await currentUser();
      if (!user) throw new UploadThingError("Unauthenticated");
      if (user.role !== "admin") throw new UploadThingError("Unauthorized");
      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("✅ Upload completed by: ", metadata.user.id);
      console.log("🔗 File url", file.url);
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.user.id };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
