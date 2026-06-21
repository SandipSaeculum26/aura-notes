import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Optional: Google-authenticated accounts have no local password
    password: {
      type: String,
    },
    // Google's stable user id (the "sub" claim) when signed in via Google
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
