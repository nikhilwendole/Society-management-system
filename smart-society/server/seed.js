/**
 * Demo data seeder.
 *
 * Usage (from /server):
 *   node seed.js          -> wipes relevant collections and inserts fresh demo data
 *   node seed.js -d        -> only wipes relevant collections (destroy mode)
 *
 * This is a dev/demo convenience script only - never run it against a
 * production database, it deletes existing documents first.
 */
require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");

const User = require("./models/User");
const Flat = require("./models/Flat");
const Complaint = require("./models/Complaint");
const Notice = require("./models/Notice");
const Maintenance = require("./models/Maintenance");
const Visitor = require("./models/Visitor");

const destroyOnly = process.argv.includes("-d");

const run = async () => {
  await connectDB();

  console.log("Clearing existing demo collections...");
  await Promise.all([
    User.deleteMany(),
    Flat.deleteMany(),
    Complaint.deleteMany(),
    Notice.deleteMany(),
    Maintenance.deleteMany(),
    Visitor.deleteMany(),
  ]);

  if (destroyOnly) {
    console.log("Collections cleared. Exiting (destroy-only mode).");
    return process.exit(0);
  }

  console.log("Creating users...");
  // Passwords are plain text here - User model's pre-save hook hashes them automatically.
  const admin = await User.create({
    name: "Anita Rao",
    email: "admin@society.com",
    password: "password123",
    phone: "9800000001",
    role: "admin",
  });

  const member1 = await User.create({
    name: "Rahul Mehta",
    email: "rahul@society.com",
    password: "password123",
    phone: "9800000002",
    role: "member",
  });

  const member2 = await User.create({
    name: "Priya Nair",
    email: "priya@society.com",
    password: "password123",
    phone: "9800000003",
    role: "member",
  });

  const guard = await User.create({
    name: "Suresh Patil",
    email: "guard@society.com",
    password: "password123",
    phone: "9800000004",
    role: "guard",
  });

  console.log("Creating flats...");
  const flatA101 = await Flat.create({
    flatNumber: "101",
    block: "A",
    owner: member1._id,
    members: [member1._id],
  });

  const flatB204 = await Flat.create({
    flatNumber: "204",
    block: "B",
    owner: member2._id,
    members: [member2._id],
  });

  await User.findByIdAndUpdate(member1._id, { flat: flatA101._id });
  await User.findByIdAndUpdate(member2._id, { flat: flatB204._id });

  console.log("Creating notices...");
  await Notice.create([
    {
      title: "Water Supply Interruption Tomorrow",
      description:
        "Water supply will be shut off tomorrow from 10 AM to 2 PM for scheduled tank cleaning. Please store water in advance.",
      createdBy: admin._id,
    },
    {
      title: "Annual General Meeting - Notice",
      description:
        "The AGM will be held this Saturday at 6 PM in the community hall. All residents are requested to attend.",
      createdBy: admin._id,
    },
  ]);

  console.log("Creating complaints...");
  await Complaint.create([
    {
      title: "Kitchen Sink Leakage",
      description:
        "There is a continuous water leak under the kitchen sink causing water to pool on the floor.",
      category: "Plumbing",
      priority: "High",
      status: "Pending",
      createdBy: member1._id,
    },
    {
      title: "Corridor Light Not Working",
      description: "The corridor light near flat B204 has not been working for the past three days.",
      category: "Electrical",
      priority: "Medium",
      status: "In Progress",
      createdBy: member2._id,
    },
  ]);

  console.log("Creating maintenance bills...");
  const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"
  await Maintenance.create([
    {
      flat: flatA101._id,
      resident: member1._id,
      amount: 2500,
      month: currentMonth,
      paymentStatus: "Pending",
    },
    {
      flat: flatB204._id,
      resident: member2._id,
      amount: 2500,
      month: currentMonth,
      paymentStatus: "Paid",
      paidAt: new Date(),
    },
  ]);

  console.log("Creating visitor records...");
  await Visitor.create([
    {
      visitorName: "Amazon Delivery",
      phone: "9900011122",
      resident: member1._id,
      visitPurpose: "Package delivery",
      approvalStatus: "Approved",
    },
    {
      visitorName: "Rohan (Friend)",
      phone: "9900033344",
      resident: member2._id,
      visitPurpose: "Personal visit",
      approvalStatus: "Pending",
    },
  ]);

  console.log("\nSeed complete. Demo accounts (all use password: password123):");
  console.log("  Admin  -> admin@society.com");
  console.log("  Member -> rahul@society.com  (flat A-101)");
  console.log("  Member -> priya@society.com  (flat B-204)");
  console.log("  Guard  -> guard@society.com");

  process.exit(0);
};

run().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
