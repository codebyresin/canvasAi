import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./db/drizzle";

// Temporary local-network workaround for TLS interception (proxy/campus/company CA).
// Enable only when needed: AUTH_INSECURE_TLS=true
if (
  process.env.NODE_ENV !== "production" &&
  process.env.AUTH_INSECURE_TLS === "true"
) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  console.warn(
    "[auth] AUTH_INSECURE_TLS=true enabled, TLS certificate verification is disabled for development.",
  );
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub],
  adapter: DrizzleAdapter(db),
});
