import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    active?: boolean;
    user: {
      id: string;
      username: string;
      alias: string;
      event?: number;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    username?: string;
    alias?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username?: string;
    alias?: string;
    event?: number;
  }
}
