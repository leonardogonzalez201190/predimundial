import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectToDB } from "./database";
import { cookies } from "next/headers";

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      async authorize(credentials: any) {
        await connectToDB();

        const user = await User.findOne({ username: credentials?.username });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials?.password, user.password);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          username: user.username,
          alias: user.alias,
        };
      },
    } as any),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {

        await connectToDB();

        let dbUser = await User.findOne({ email: user.email });

        if (!dbUser) {
          try {
            dbUser = await User.create({
              username: user.name,
              alias: user.name,
              email: user.email,
            });
          } catch (error) {
            console.error(error);
            return false;
          }
        }

        user.id = dbUser._id.toString();
        return true;
      }
      return true;
    },

    async jwt({ token, user, account }) {
      const cookieStore = await cookies();
      const event = cookieStore.get("event");
      await connectToDB();

      // Si viene de Google, user.id NO es tu MongoID, es el id de Google
      if (account?.provider === "google") {
        const dbUser = await User.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.username = dbUser.username;
          token.alias = dbUser.alias;
          token.event = event ? Number(event.value) : undefined;
        }
      }

      // Si viene de credentials, ahí sí user.id ya es tu MongoID
      if (user && account?.provider === "credentials") {
        token.id = user.id;
        token.username = user.username;
        token.alias = user.alias;
        token.event = event ? Number(event.value) : undefined;
      }

      return token;
    },

    async session({ session, token }) {
      await connectToDB();

      const isActive = await User.exists({ _id: token.id });

      session.user.id = token.id as string;
      session.user.username = token.username as string;
      session.user.alias = token.alias as string;
      session.user.event = token.event as number;
      session.active = Boolean(isActive);

      return session;
    },
  },
};
