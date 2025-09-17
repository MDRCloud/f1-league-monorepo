import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { z } from "zod";

type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    name?: string | null;
    roles: string[];
  };
};

const credentialsSchema = z.object({
  email: z.string().email("A valid email address is required."),
  password: z.string().min(1, "Password is required.")
});

const knownRoles = new Set(["ADMIN", "STEWARD", "DRIVER", "VIEWER"]);

function resolveRoles(roles: string[] | undefined | null): string[] {
  if (!roles) return [];
  return roles.filter(role => knownRoles.has(role));
}

function getApiBaseUrl() {
  return process.env.API_BASE_URL?.replace(/\/$/, "") || "http://localhost:4000";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) {
          const firstError = parsed.error.errors.at(0)?.message ?? "Invalid credentials";
          throw new Error(firstError);
        }

        try {
          const response = await fetch(`${getApiBaseUrl()}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed.data),
            cache: "no-store"
          });

          if (!response.ok) {
            return null;
          }

          const payload = (await response.json()) as LoginResponse | null;
          if (!payload?.token || !payload.user) {
            return null;
          }

          return {
            id: payload.user.id,
            email: payload.user.email,
            name: payload.user.name ?? null,
            roles: resolveRoles(payload.user.roles),
            token: payload.token
          };
        } catch (error) {
          console.error("Failed to authenticate", error);
          throw new Error("Unable to reach authentication service. Please try again.");
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name ?? null;
        token.roles = (user as any).roles ?? [];
        token.accessToken = (user as any).token as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      const roles = (token.roles as string[] | undefined) ?? [];
      if (session.user) {
        session.user.id = (token.sub as string) ?? session.user.id;
        session.user.email = (token.email as string) ?? session.user.email;
        session.user.name = (token.name as string | null | undefined) ?? session.user.name;
        session.user.roles = roles;
      } else {
        session.user = {
          id: (token.sub as string) ?? "",
          email: (token.email as string) ?? "",
          name: (token.name as string | null | undefined) ?? null,
          roles
        };
      }
      session.apiToken = (token.accessToken as string | undefined) ?? undefined;
      session.roles = roles;
      return session;
    }
  }
};
