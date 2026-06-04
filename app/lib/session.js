import { cookies } from "next/headers";
import { getUserByToken } from "./users-store";

// Returns the logged-in customer ({ name, email }) or null. Never exposes the
// password hash or token.
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  const user = await getUserByToken(token);
  if (!user) return null;
  return { name: user.name, email: user.email };
}
