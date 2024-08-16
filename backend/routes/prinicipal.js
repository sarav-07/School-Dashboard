import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Classroom from "../models/Classroom.js";
const router = express.Router();

router.get(
  "/users",
  authenticate,
  authorize(["Principal", "Teacher", "Student"]),
  async (req, res) => {
    try {
      const users = await User.find({}, "-password");
      const teachers = users.filter((user) => user.role === "Teacher");
      const students = users.filter((user) => user.role === "Student");
      res.json({ teachers, students });
    } catch (err) {
      return res.status(500).send("Error fetching users");
    }
  }
);

router.get(
  "/classrooms",
  authenticate,
  authorize(["Principal", "Teacher"]),
  async (req, res) => {
    try {
      const classrooms = await Classroom.find();
      res.json({ classrooms });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error fetching classrooms");
    }
  }
);

router.post("/principal", async (req, res) => {
  try {
    const existingPrincipal = await User.findOne({ role: "Principal" });
    if (existingPrincipal)
      return res.status(400).send("Principal already exists");

    const principal = new User({
      name: "Principal",
      email: "principal@classroom.com",
      password: "Admin",
      role: "Principal",
    });
    await principal.save();
    res.send("Principal account initialized");
  } catch (err) {
    console.error("Error details:", err);
    res.status(500).send("Error creating Principal account");
  }
});

// Creating Classroom

router.post(
  "/create-classroom",
  authenticate,
  authorize(["Principal"]),
  async (req, res) => {
    const { name, startTime, endTime, days } = req.body;

    try {
      const classroom = new Classroom({ name, startTime, endTime, days });
      await classroom.save();
      res.json(classroom);
    } catch (err) {
      res.status(500).send("Error creating Classroom");
    }
  }
);

// Creating teacher/student account

router.post(
  "/create-user",
  authenticate,
  authorize(["Principal"]),
  async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!["Teacher", "Student"].includes(role)) {
        return res.status(400).send("Invalid role");
      }
      const user = new User({
        name,
        email,
        password,
        role,
      });
      await user.save();
      res.send(`${role} account created`);
    } catch (err) {
      res.status(500).send("Error creating user");
    }
  }
);
// Assigning teacher

router.post(
  "/assign-teacher",
  authenticate,
  authorize(["Principal"]),
  async (req, res) => {
    const { teacherId, classroomId } = req.body;

    try {
      const classroom = await Classroom.findById(classroomId);
      if (!classroom) return res.status(404).send("Classroom not found");
      const teacher = await User.findOne({ _id: teacherId, role: "Teacher" });
      if (!teacher) return res.status(404).send("Teacher not found");

      teacher.classroom = classroomId;
      await teacher.save();
      classroom.teacher = teacherId;
      await classroom.save();

      res.send("Teacher assigned to classroom");
    } catch (err) {
      console.error(err);
      res.status(500).send("Error assigning teacher");
    }
  }
);

export default router;
