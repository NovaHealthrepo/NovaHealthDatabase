import { prisma } from "./src/prismaClient.js";

async function fetchUserAndStaffIds() {
  try {
    console.log("Fetching users...");
    const users = await prisma.user.findMany({
      select: {
        userID: true,
        name: true,
      },
    });
    
    console.log("\nUsers:");
    users.forEach((user) => {
      console.log(`ID: ${user.userID}, Name: ${user.name}`);
    });

    console.log("\n\nFetching staff...");
    const staff = await prisma.staff.findMany({
      select: {
        staffID: true,
        name: true,
        position: true,
      },
    });

    console.log("\nStaff:");
    staff.forEach((s) => {
      console.log(`ID: ${s.staffID}, Name: ${s.name}, Position: ${s.position}`);
    });

  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

fetchUserAndStaffIds();
