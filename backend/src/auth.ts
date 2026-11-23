import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare, hash } from "bcryptjs";
import { z } from "zod";
import { createHmac } from "node:crypto";
import { db } from "@backend/lib/db";
import { rateLimit } from "@backend/lib/quota";
import { logAuthActivity } from "@backend/lib/activity";
import { syncUserPasswordPlain } from "@backend/lib/password";
import { normalizeRole } from "@backend/lib/roles";

const credentialsSchema = z.object({
  email: z.string().email().max(254),
  password: z
    .string()
    .min(12)
    .max(72)
    .refine((s) => Buffer.byteLength(s, "utf8") <= 72),
});

const dummyHash = hash("unused-password-for-timing", 12);

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },
  pages: { signIn: "/signin" },
  logger: { error() {}, warn() {}, debug() {} },
  events: {
    async signOut(message) {
      if (!("token" in message) || !message.token?.id) return;
      const email = (message.token.email as string | undefined) ?? "User";
      void logAuthActivity(message.token.id as string, "sign_out", `${email} signed out`).catch(
        () => {},
      );
    },
  },
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(input) {
        const parsed = credentialsSchema.safeParse(input);
        if (!parsed.success) return null;
        const email = parsed.data.email.toLowerCase();
        await rateLimit(
          `login:${createHmac("sha256", process.env.AUTH_SECRET!)
            .update(email)
            .digest("hex")}`,
          8,
        );
        const user = await db.user.findUnique({
          where: { email },
          select: { id: true, email: true, passwordHash: true, passwordPlain: true },
        });
        const valid = await compare(
          parsed.data.password,
          user?.passwordHash ?? (await dummyHash),
        );
        if (!user || !valid) return null;
        await syncUserPasswordPlain(user.id, parsed.data.password);
        void logAuthActivity(user.id, "sign_in", `${email} signed in`).catch(() => {});
        return { id: user.id, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      if (token.id) {
        const row = await db.user.findUnique({
          where: { id: token.id as string },
          select: { email: true, role: true },
        });
        if (row) {
          token.email = row.email;
          token.role = normalizeRole(row.role);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user || !token.id) return session;
      session.user.id = token.id as string;
      session.user.email = (token.email as string | undefined) ?? session.user.email;
      session.user.role = normalizeRole(token.role);
      return session;
    },
  },
});

export { credentialsSchema };