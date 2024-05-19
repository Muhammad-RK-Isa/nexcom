import { useSession } from "next-auth/react";

export function useClientCurrentUser() {
  const { data: session } = useSession();
  return session?.user;
}
