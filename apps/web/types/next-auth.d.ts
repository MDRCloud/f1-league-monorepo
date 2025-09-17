import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
      email: string;
      name?: string | null;
      roles: string[];
    };
    apiToken?: string;
    roles: string[];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    roles: string[];
    token: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles?: string[];
    accessToken?: string;
  }
}
