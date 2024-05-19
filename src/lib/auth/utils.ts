import { getServerAuthSession } from "~/server/auth";

export const currentUser = async () => {
  const session = await getServerAuthSession();

  return session?.user;
};

export const currentRole = async () => {
  const session = await getServerAuthSession();

  return session?.user.role;
};
