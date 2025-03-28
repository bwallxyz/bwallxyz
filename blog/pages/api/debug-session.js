// pages/api/debug-session.js
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  res.status(200).json({ 
    authenticated: !!session, 
    session: session,
    isAdmin: session?.user?.role === 'admin'
  });
}