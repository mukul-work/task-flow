import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import {
  getUserByEmail,
  upsertGoogleUser,
  verifyCredentials,
} from "@/services/userService";

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.NEXT_AUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/",
  },

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const result = await verifyCredentials({
          email: credentials.email,
          password: credentials.password,
        });

        if (!result.ok) return null;

        return {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          image: result.user.image,
        };
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Only run the Google upsert for the google provider
      if (account?.provider === "google") {
        if (!user.email || !account?.providerAccountId) return false;
        await upsertGoogleUser({
          email: user.email,
          googleId: account.providerAccountId,
          name: user.name || undefined,
          image: user.image || undefined,
        });
      }
      return true;
    },

    async jwt({ token, user }) {
      // On first sign-in, user object is available; attach DB id to token
      if (user?.id) {
        token.uid = user.id;
      } else if (user?.email && !token.uid) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) token.uid = dbUser._id.toString();
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
