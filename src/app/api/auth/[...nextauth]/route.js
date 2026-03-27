import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUserByEmail, upsertGoogleUser } from "@/services/userService";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (!user.email || !account?.providerAccountId) return false;

      await upsertGoogleUser({
        email: user.email,
        googleId: account.providerAccountId,
        name: user.name || undefined,
        image: user.image || undefined,
      });

      return true;
    },

    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.uid = dbUser._id.toString();
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.uid) {
        session.user.id = token.uid;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };