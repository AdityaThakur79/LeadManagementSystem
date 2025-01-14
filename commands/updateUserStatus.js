import mongoose from "mongoose";
import { User } from "../models/user.js"; // Ensure the path is correct

// Function to connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://adityathakur:adityathakur@cluster0.m8ghgdt.mongodb.net/lmp"
    );
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
}

async function updateUserStatusByEmail(email, status) {
  try {
    const user = await User.findOne({ email }).select(
      "_id name email status role"
    );
    if (!user) {
      console.error(`User with email ${email} not found.`);
      process.exit(1);
    }
    if (user.role === "superAdmin") {
      console.error(`SuperAdmin Cannot be Deactivated`);
      process.exit(1);
    }
    user.status = status;
    await user.save();

    console.log(
      `User with email ${email} is now ${status ? "activated" : "deactivated"}.`
    );
  } catch (error) {
    console.error("Error updating user status:", error.message);
    process.exit(1);
  }
}

// Main Execution
(async () => {
  const [, , email, action] = process.argv;

  if (!email || !action) {
    console.error("Usage: node updateStatus.js <email> <activate|deactivate>");
    process.exit(1);
  }

  const status = action === "activate" ? true : false;

  await connectDB();
  await updateUserStatusByEmail(email, status);

  //closes the database connection
  mongoose.connection.close();
})();
