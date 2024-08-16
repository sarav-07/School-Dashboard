import express from "express";
import  { authenticate, authorize } from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Classroom from "../models/Classroom.js";

const router = express.Router();

const checkStudent = async (req, res, next) => {
  if (req.user.role !== "Student") {
    return res.status(404).json({ message: "Student not found" });
  }

  const classroom = await Classroom.findOne({ students: req.user._id });

  if (!classroom)
    return res.status(404).json({ message: "Classroom not found" });
  req.classroom = classroom;
  next();
};

router.get("/classroom", authorize, authenticate, (req, res) => {
  res.json(req.classroom);
});

router.get("/timetable", authorize, authenticate, (req, res) => {
  res.json(req.classroom.timetable);
});


export default router
