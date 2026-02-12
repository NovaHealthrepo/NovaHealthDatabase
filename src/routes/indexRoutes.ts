import { Router, Request, Response } from "express";
import { prisma } from "../prismaClient.js";

const router = Router();

// ==================== Index CRUD ====================

// GET all index records (with user & staff names)
router.get("/indices", async (_req: Request, res: Response) => {
  try {
    const indices = await prisma.index.findMany({
      include: {
        user: { select: { userID: true, name: true } },
        staff: { select: { staffID: true, name: true, position: true } },
      },
      orderBy: { serviceID: "asc" },
    });
    // Log service 13 to check duration from DB
    const s13 = indices.find(i => i.serviceID === 13);
    if (s13) console.log('[BACKEND] Service 13 from Prisma:', { serviceID: s13.serviceID, duration: s13.duration, type: typeof s13.duration });
    res.json(indices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch indices" });
  }
});

// GET single index record
router.get("/indices/:id", async (req: Request, res: Response) => {
  try {
    const record = await prisma.index.findUnique({
      where: { serviceID: Number(req.params.id) },
      include: {
        user: { select: { userID: true, name: true } },
        staff: { select: { staffID: true, name: true, position: true } },
      },
    });
    if (!record) return res.status(404).json({ error: "Record not found" });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch record" });
  }
});

// POST create index record
router.post("/indices", async (req: Request, res: Response) => {
  try {
    const {
      time,
      date,
      duration,
      userID,
      staffID,
      Price,
      salary,
      isfreelance,
      reportTime,
      isReserved,
      isAttended,
      isRecorded,
    } = req.body;

    const record = await prisma.index.create({
      data: {
        time: new Date(`1970-01-01T${time}`),
        date: new Date(date),
        duration: duration ?? 2,
        userID: Number(userID),
        staffID: Number(staffID),
        Price: Number(Price),
        salary: salary,
        isfreelance: isfreelance ?? true,
        reportTime: new Date(`1970-01-01T${reportTime}`),
        isReserved: isReserved ?? true,
        isAttended: isAttended ?? false,
        isRecorded: isRecorded ?? false,
      },
      include: {
        user: { select: { userID: true, name: true } },
        staff: { select: { staffID: true, name: true, position: true } },
      },
    });
    res.status(201).json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create record" });
  }
});

// PUT update index record
router.put("/indices/:id", async (req: Request, res: Response) => {
  try {
    const {
      time,
      date,
      duration,
      userID,
      staffID,
      Price,
      salary,
      isfreelance,
      reportTime,
      isReserved,
      isAttended,
      isRecorded,
    } = req.body;

    const data: Record<string, unknown> = {};
    if (time !== undefined) data.time = new Date(`1970-01-01T${time}`);
    if (date !== undefined) data.date = new Date(date);
    if (duration !== undefined) data.duration = Number(duration);
    if (userID !== undefined) data.userID = Number(userID);
    if (staffID !== undefined) data.staffID = Number(staffID);
    if (Price !== undefined) data.Price = Number(Price);
    if (salary !== undefined) data.salary = salary;
    if (isfreelance !== undefined) data.isfreelance = isfreelance;
    if (reportTime !== undefined) data.reportTime = new Date(`1970-01-01T${reportTime}`);
    if (isReserved !== undefined) data.isReserved = isReserved;
    if (isAttended !== undefined) data.isAttended = isAttended;
    if (isRecorded !== undefined) data.isRecorded = isRecorded;

    const record = await prisma.index.update({
      where: { serviceID: Number(req.params.id) },
      data,
      include: {
        user: { select: { userID: true, name: true } },
        staff: { select: { staffID: true, name: true, position: true } },
      },
    });
    res.json(record);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update record" });
  }
});

// DELETE index record
router.delete("/indices/:id", async (req: Request, res: Response) => {
  try {
    await prisma.index.delete({
      where: { serviceID: Number(req.params.id) },
    });
    res.json({ message: "Record deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete record" });
  }
});

// ==================== Helper endpoints ====================

// GET all users (for dropdown)
router.get("/index-users", async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { userID: true, name: true },
      orderBy: { userID: "asc" },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET all staff (for dropdown)
router.get("/index-staff", async (_req: Request, res: Response) => {
  try {
    const staff = await prisma.staff.findMany({
      select: { staffID: true, name: true, position: true },
      orderBy: { staffID: "asc" },
    });
    res.json(staff);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
});

// ==================== Calculation endpoints ====================

// GET sum of price for specific user in a specific month
// Query params: userID, year, month
// Example: /api/user-price-sum?userID=1&year=2026&month=1
router.get("/user-price-sum", async (req: Request, res: Response) => {
  try {
    const { userID, year, month } = req.query;
    
    if (!userID || !year || !month) {
      return res.status(400).json({ 
        error: "Missing required parameters: userID, year, month" 
      });
    }

    const userId = Number(userID);
    const yearNum = Number(year);
    const monthNum = Number(month);

    // Use UTC to avoid local-timezone shift on @db.Date columns
    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0));

    const records = await prisma.index.findMany({
      where: {
        userID: userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        Price: true,
        duration: true,
        serviceID: true,
        date: true,
      },
    });

    const totalPrice = records.reduce((sum, record) => sum + (record.Price * Number(record.duration)), 0);
    const totalHours = records.reduce((sum, record) => sum + Number(record.duration), 0);

    res.json({
      userID: userId,
      year: yearNum,
      month: monthNum,
      totalPrice: Math.round(totalPrice),
      totalHours,
      recordCount: records.length,
      records: records.map(r => ({
        serviceID: r.serviceID,
        date: r.date,
        price: r.Price,
        duration: Number(r.duration),
        totalPrice: Math.round(r.Price * Number(r.duration)),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate user price sum" });
  }
});

// GET sum of salary for specific staff in a specific month
// Query params: staffID, year, month
// Example: /api/staff-salary-sum?staffID=1&year=2026&month=1
router.get("/staff-salary-sum", async (req: Request, res: Response) => {
  try {
    const { staffID, year, month } = req.query;
    
    if (!staffID || !year || !month) {
      return res.status(400).json({ 
        error: "Missing required parameters: staffID, year, month" 
      });
    }

    const staffId = Number(staffID);
    const yearNum = Number(year);
    const monthNum = Number(month);

    // Use UTC to avoid local-timezone shift on @db.Date columns
    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0));

    const records = await prisma.index.findMany({
      where: {
        staffID: staffId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        salary: true,
        serviceID: true,
        date: true,
        duration: true,
      },
    });

    const totalSalary = records.reduce((sum, record) => 
      sum + Number(record.salary), 0
    );
    const totalHours = records.reduce((sum, record) => sum + Number(record.duration), 0);

    res.json({
      staffID: staffId,
      year: yearNum,
      month: monthNum,
      totalSalary: Math.round(totalSalary),
      totalHours,
      recordCount: records.length,
      records: records.map(r => ({
        serviceID: r.serviceID,
        date: r.date,
        salary: Math.round(Number(r.salary)),
        duration: Number(r.duration),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate staff salary sum" });
  }
});

// GET monthly summary for all users or all staff
// Query params: type (user/staff), year, month
// Example: /api/monthly-summary?type=user&year=2026&month=1
router.get("/monthly-summary", async (req: Request, res: Response) => {
  try {
    const { type, year, month } = req.query;
    
    if (!type || !year || !month) {
      return res.status(400).json({ 
        error: "Missing required parameters: type, year, month" 
      });
    }

    const yearNum = Number(year);
    const monthNum = Number(month);

    // Use UTC to avoid local-timezone shift on @db.Date columns
    const startDate = new Date(Date.UTC(yearNum, monthNum - 1, 1));
    const endDate = new Date(Date.UTC(yearNum, monthNum, 0));

    if (type === "user") {
      const records = await prisma.index.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: { select: { userID: true, name: true } },
        },
      });

      // Group by user
      const userSummary = records.reduce((acc: any, record) => {
        const userId = record.userID;
        if (!acc[userId]) {
          acc[userId] = {
            userID: userId,
            userName: record.user.name,
            totalPrice: 0,
            totalHours: 0,
            recordCount: 0,
          };
        }
        acc[userId].totalPrice += Math.round(record.Price * Number(record.duration));
        acc[userId].totalHours += Number(record.duration);
        acc[userId].recordCount += 1;
        return acc;
      }, {});

      res.json({
        year: yearNum,
        month: monthNum,
        type: "user",
        summary: Object.values(userSummary),
      });
    } else if (type === "staff") {
      const records = await prisma.index.findMany({
        where: {
          date: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          staff: { select: { staffID: true, name: true, position: true } },
        },
      });

      // Group by staff
      const staffSummary = records.reduce((acc: any, record) => {
        const staffId = record.staffID;
        if (!acc[staffId]) {
          acc[staffId] = {
            staffID: staffId,
            staffName: record.staff.name,
            position: record.staff.position,
            totalSalary: 0,
            totalHours: 0,
            recordCount: 0,
          };
        }
        acc[staffId].totalSalary += Math.round(Number(record.salary));
        acc[staffId].totalHours += Number(record.duration);
        acc[staffId].recordCount += 1;
        return acc;
      }, {});

      res.json({
        year: yearNum,
        month: monthNum,
        type: "staff",
        summary: Object.values(staffSummary),
      });
    } else {
      res.status(400).json({ error: "Invalid type. Must be 'user' or 'staff'" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to calculate monthly summary" });
  }
});

export default router;
