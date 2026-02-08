import "dotenv/config";
import express from "express";
import { Gender, PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

console.log("tester");

const connectionString = process.env.DATABASE_URL!;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const sets = [
  {
    userID: 2,
    gender: "F",
    contactPerson: "劉小姐",
    phone: "91200978",
    birth: new Date("1939-10-03"),
    IDcard: "B3075309",
    address: "大埔帝欣院一期11座5樓A室",
    email: "lauyatfan888@gmail.com",
  },
  {
    userID: 3,
    gender: "M",
    contactPerson: "吳榮貞",
    phone: "93457810",
    birth: new Date("1960-10-10"),
    IDcard: "C3319502",
    address: "新界大埔元嶺46號",
  },
  {
    userID: 4,
    gender: "M",
    contactPerson: "陳森念",
    phone: "91731458",
    birth: new Date("1900-01-01"),
    IDcard: "探親簽",
    address: "啟德沐泰街9號嘉豐匯",
  },
  {
    userID: 5,
    gender: "F",
    contactPerson: "陳森念",
    phone: "91731458",
    birth: new Date("1900-01-01"),
    IDcard: "探親簽",
    address: "啟德沐泰街9號嘉豐匯",
  },
];

async function main() {
  for (const set of sets) {
    await prisma.userProfile.create({
      data: {
        userID: set.userID,
        gender: set.gender as Gender,
        contactPerson: set.contactPerson,
        phone: set.phone,
        birth: set.birth,
        IDcard: set.IDcard,
        address: set.address,
        email: set.email,
      },
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
