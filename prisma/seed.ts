import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from "fs";
import * as path from "path";

console.log("Starting seed process...");

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Read seed data from JSON file
const seedDataPath = path.join(process.cwd(), "prisma", "seedData.json");
const seedData = JSON.parse(fs.readFileSync(seedDataPath, "utf-8"));

async function main() {
  console.log(`Seeding ${seedData.length} Index records...`);
  
  for (const record of seedData) {
    // Parse time and date strings
    const timeStr = record.time;
    const dateStr = record.date;
    const reportTimeStr = record.reportTime;
    
    // Create DateTime objects for time fields (using arbitrary date for time-only fields)
    const timeDate = new Date(`1970-01-01T${timeStr}`);
    const reportTimeDate = new Date(`1970-01-01T${reportTimeStr}`);
    const date = new Date(dateStr);
    
    await prisma.index.create({
      data: {
        time: timeDate,
        date: date,
        duration: record.duration,
        userID: record.userID,
        staffID: record.staffID,
        Price: record.Price,
        salary: record.salary,
        isfreelance: record.isfreelance,
        reportTime: reportTimeDate,
        isReserved: record.isReserved,
        isAttended: record.isAttended,
        isRecorded: record.isRecorded,
      },
    });
  }
  
  console.log(`Successfully seeded ${seedData.length} Index records!`);
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
