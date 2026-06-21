import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.js";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register a new user
const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log an existing user in
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Logged in successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Sign in / sign up with a Google ID token (works for both login and signup)
const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({ message: "Google login is not configured" });
    }

    // Verify the ID token came from Google and was issued for our client
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, email_verified: emailVerified } = payload;

    if (!email || !emailVerified) {
      return res.status(401).json({ message: "Google account email is not verified" });
    }

    // Find by Google id first, then fall back to email to link existing accounts
    let user = await User.findOne({ googleId });
    if (!user) {
      user = await User.findOne({ email });
      if (user) {
        // Existing email/password account — link the Google identity to it
        user.googleId = googleId;
        if (!user.name && name) user.name = name;
        await user.save();
      } else {
        user = await User.create({ googleId, email, name });
      }
    }

    res.json({
      message: "Logged in with Google",
      user: { id: user._id, email: user.email, name: user.name },
    });
  } catch (error) {
    // Token verification failures land here too
    res.status(401).json({ message: "Google authentication failed" });
  }
};

export { signup, login, googleAuth };
