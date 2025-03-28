// pages/api/auth/register.js
import { connectToDatabase } from "../../../lib/db";
import User from "../../../models/User";
import { hash } from "bcryptjs";

export default async function handler(req, res) {
  // Enable CORS for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    console.log("Register API called with body:", req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password });
      return res.status(422).json({ message: "Invalid input - all fields are required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return res.status(422).json({ message: "Invalid email format" });
    }

    // Validate password strength
    if (password.length < 6) {
      console.log("Password too short");
      return res.status(422).json({ message: "Password must be at least 6 characters" });
    }

    // Connect to database
    console.log("Connecting to database...");
    try {
      await connectToDatabase();
      console.log("Connected to database successfully");
    } catch (dbError) {
      console.error("Database connection error:", dbError);
      return res.status(500).json({ message: "Failed to connect to database" });
    }

    // Check if user already exists
    console.log("Checking if user exists:", email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      return res.status(422).json({ message: "User with this email already exists" });
    }

    // Hash password
    console.log("Hashing password...");
    const hashedPassword = await hash(password, 12);

    // Create the first user as admin, subsequent users as regular users
    console.log("Counting users...");
    const userCount = await User.countDocuments({});
    const role = userCount === 0 ? "admin" : "user";
    console.log(`User will be created with role: ${role} (${userCount} existing users)`);

    // Create new user
    console.log("Creating user...");
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await user.save();
    console.log("User created successfully:", user._id);
    
    // Return success
    return res.status(201).json({ message: "User created successfully", success: true });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ 
      message: "Server error during registration", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
    });
  }
}