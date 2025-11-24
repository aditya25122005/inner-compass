/**
 * Database Migration Script
 * Run this to migrate existing users from username-based to email-based authentication
 * 
 * Usage: node migrate-users.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/inner-compass";

async function migrateUsers() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✓ Connected to MongoDB");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    console.log("\n=================================");
    console.log("User Migration Script");
    console.log("=================================\n");

    // Count existing users
    const totalUsers = await usersCollection.countDocuments();
    console.log(`Found ${totalUsers} users in database\n`);

    if (totalUsers === 0) {
      console.log("No users to migrate. Database is clean!");
      await mongoose.connection.close();
      return;
    }

    // Check if users have username field
    const usersWithUsername = await usersCollection.countDocuments({ 
      username: { $exists: true } 
    });

    console.log(`Users with username field: ${usersWithUsername}`);

    if (usersWithUsername === 0) {
      console.log("✓ All users already migrated!");
      await mongoose.connection.close();
      return;
    }

    console.log("\nStarting migration...\n");

    // Remove username field and add new phone fields
    const result = await usersCollection.updateMany(
      { username: { $exists: true } },
      {
        $unset: { 
          username: "" 
        },
        $set: {
          isPhoneVerified: false,
          phoneNumber: null,
          countryCode: null,
          firstName: null,
          lastName: null
        }
      }
    );

    console.log("Migration Results:");
    console.log(`- Modified: ${result.modifiedCount} users`);
    console.log(`- Matched: ${result.matchedCount} users`);

    // Verify migration
    const remainingWithUsername = await usersCollection.countDocuments({ 
      username: { $exists: true } 
    });

    if (remainingWithUsername === 0) {
      console.log("\n✓ Migration completed successfully!");
      console.log("\nAll users now use email-based authentication.");
    } else {
      console.log(`\n⚠ Warning: ${remainingWithUsername} users still have username field`);
    }

    // Show sample user structure
    console.log("\nSample user structure:");
    const sampleUser = await usersCollection.findOne({}, {
      projection: { 
        email: 1, 
        name: 1, 
        age: 1, 
        sex: 1, 
        isPhoneVerified: 1,
        phoneNumber: 1,
        countryCode: 1,
        createdAt: 1 
      }
    });
    console.log(JSON.stringify(sampleUser, null, 2));

    await mongoose.connection.close();
    console.log("\n✓ Database connection closed");
    console.log("\nMigration complete! You can now start your application.");

  } catch (error) {
    console.error("Migration error:", error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
console.log("\n⚠ IMPORTANT: Backup your database before running this migration!");
console.log("Press Ctrl+C to cancel, or wait 5 seconds to continue...\n");

setTimeout(() => {
  migrateUsers();
}, 5000);
