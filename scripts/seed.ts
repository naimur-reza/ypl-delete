/* Seed script – run with: npx tsx scripts/seed.ts */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/ypl";

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["superadmin", "admin", "manager"] },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    isActive: { type: Boolean, default: true },
  }, { timestamps: true }));

  const existing = await User.findOne({ email: "admin@ypl.com" });
  if (existing) {
    console.log("Admin user already exists");
  } else {
    const hashed = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Super Admin",
      email: "admin@ypl.com",
      password: hashed,
      role: "superadmin",
      isActive: true,
    });
    console.log("Created superadmin: admin@ypl.com / admin123");
  }

  await mongoose.disconnect();
  console.log("Done");
}

seed().catch(console.error);
