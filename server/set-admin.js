/**
 * Promote a user to admin by email.
 * Usage: node server/set-admin.js <user-email>
 */
import "dotenv/config";
import connectDB from "./db.js";
import User from "./models/User.js";

const email = process.argv[2];

if (!email) {
  console.log("Usage: node server/set-admin.js <user-email>");
  process.exit(1);
}

async function setAdmin() {
  await connectDB();
  const user = await User.findOneAndUpdate(
    { email },
    { role: "admin" },
    { new: true }
  );
  if (!user) {
    console.log(`No user found with email: ${email}`);
    process.exit(1);
  }
  console.log(`User ${user.username} (${user.email}) is now an admin.`);
  process.exit(0);
}

setAdmin().catch((err) => {
  console.error("set-admin failed:", err);
  process.exit(1);
});
