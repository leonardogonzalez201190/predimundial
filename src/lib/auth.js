import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { connectToDB } from "./database";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        await connectToDB();

        const user = await User.findOne({ username: credentials.username });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.password);
        if (!valid) return null;

        return {
          id: user._id,
          username: user.username,
          alias: user.alias
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.alias = user.alias;
      }
      return token;
    },
  
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.alias = token.alias;
      return session;
    }
  }
};
