import { Router } from "express";
import { prisma } from "../prismaClient.js";
const router = Router();
// ==================== User CRUD ====================
// GET all users (with optional profile)
router.get("/users", async (_req, res) => {
    try {
        const users = await prisma.user.findMany({
            include: { profile: true },
            orderBy: { userID: "asc" },
        });
        res.json(users);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});
// GET single user
router.get("/users/:id", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { userID: Number(req.params.id) },
            include: { profile: true },
        });
        if (!user)
            return res.status(404).json({ error: "User not found" });
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});
// POST create user
router.post("/users", async (req, res) => {
    try {
        const { name } = req.body;
        const user = await prisma.user.create({
            data: { name },
        });
        res.status(201).json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create user" });
    }
});
// PUT update user
router.put("/users/:id", async (req, res) => {
    try {
        const { name } = req.body;
        const user = await prisma.user.update({
            where: { userID: Number(req.params.id) },
            data: { name },
        });
        res.json(user);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update user" });
    }
});
// DELETE user (will cascade delete profile if exists)
router.delete("/users/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        // Delete profile first if exists
        await prisma.userProfile.deleteMany({ where: { userID: id } });
        await prisma.user.delete({ where: { userID: id } });
        res.json({ message: "User deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete user" });
    }
});
// ==================== UserProfile CRUD ====================
// GET all profiles
router.get("/profiles", async (_req, res) => {
    try {
        const profiles = await prisma.userProfile.findMany({
            include: { user: true },
            orderBy: { userID: "asc" },
        });
        res.json(profiles);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profiles" });
    }
});
// GET single profile by userID
router.get("/profiles/:userID", async (req, res) => {
    try {
        const profile = await prisma.userProfile.findUnique({
            where: { userID: Number(req.params.userID) },
            include: { user: true },
        });
        if (!profile)
            return res.status(404).json({ error: "Profile not found" });
        res.json(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch profile" });
    }
});
// POST create profile
router.post("/profiles", async (req, res) => {
    try {
        const { userID, phone, email, address, contactPerson, secondPhone, secondContactPerson, gender, birth, IDcard, IDcardUrl, } = req.body;
        const profile = await prisma.userProfile.create({
            data: {
                userID: Number(userID),
                phone,
                email: email || "沒有電郵",
                address,
                contactPerson: contactPerson || "本人",
                secondPhone: secondPhone || "沒有第二電話",
                secondContactPerson: secondContactPerson || "沒有第二聯絡人",
                gender,
                birth: new Date(birth),
                IDcard: IDcard || "請盡快提供ID",
                IDcardUrl: IDcardUrl || undefined,
            },
        });
        res.status(201).json(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create profile" });
    }
});
// PUT update profile
router.put("/profiles/:userID", async (req, res) => {
    try {
        const { phone, email, address, contactPerson, secondPhone, secondContactPerson, gender, birth, IDcard, IDcardUrl, isActive, } = req.body;
        const data = {};
        if (phone !== undefined)
            data.phone = phone;
        if (email !== undefined)
            data.email = email;
        if (address !== undefined)
            data.address = address;
        if (contactPerson !== undefined)
            data.contactPerson = contactPerson;
        if (secondPhone !== undefined)
            data.secondPhone = secondPhone;
        if (secondContactPerson !== undefined)
            data.secondContactPerson = secondContactPerson;
        if (gender !== undefined)
            data.gender = gender;
        if (birth !== undefined)
            data.birth = new Date(birth);
        if (IDcard !== undefined)
            data.IDcard = IDcard;
        if (IDcardUrl !== undefined)
            data.IDcardUrl = IDcardUrl;
        if (isActive !== undefined)
            data.isActive = isActive;
        const profile = await prisma.userProfile.update({
            where: { userID: Number(req.params.userID) },
            data,
        });
        res.json(profile);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update profile" });
    }
});
// DELETE profile
router.delete("/profiles/:userID", async (req, res) => {
    try {
        await prisma.userProfile.delete({
            where: { userID: Number(req.params.userID) },
        });
        res.json({ message: "Profile deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete profile" });
    }
});
export default router;
