import { currentUser } from "@backend/lib/access";

export type HeaderUser = Awaited<ReturnType<typeof currentUser>>;

/** Session for header/footer; never throw if auth chunk or DB is unavailable. */
export async function safeHeaderUser(): Promise<HeaderUser> {
  try {
    return await currentUser();
  } catch (err) {
    console.error("[safeHeaderUser]", err);
    return null;
  }
}