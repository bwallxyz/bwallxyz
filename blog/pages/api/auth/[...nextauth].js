// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "../../../lib/supabase";
import { compare } from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Find the user by email
          const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', credentials.email)
            .single();

          // If no user found, return null (which will trigger a login error)
          if (error || !user) {
            return null;
          }

          // Check if the password is correct
          const isValid = await compare(credentials.password, user.password);

          // If password doesn't match, return null
          if (!isValid) {
            return null;
          }

          // Return the user object (without the password)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      }
    })
  ],
  // Configure session handling
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  // Configure callbacks
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  // Configure custom pages
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  // Enable debug mode in development
  debug: process.env.NODE_ENV === "development",
  // Use a secure secret key
  secret: process.env.NEXTAUTH_SECRET || "YOUR_FALLBACK_SECRET_FOR_DEVELOPMENT_ONLY",
};

export default NextAuth(authOptions);