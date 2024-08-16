import express from "express";
import { authenticate, authorize } from "../middleware/authMiddleware.js";
import Classroom from "../models/Classroom.js";
import User from "../models/User.js";

const router = express.Router();

router.get(
  "/users",
  authenticate,
  authorize(['Principal', 'Teacher']),
  async (req, res) => {
    try {
      const users = await User.find({}, "-password").populate('classroomId')
      console.log(users)
      const teachers = users.filter((user) => user.role === "Teacher");
      const students = users.filter((user) => user.role === "Student");
      res.json({ teachers, students });
    } catch (err) {
      return res.status(500).send("Error fetching users");
    }
  }
);

router.get(
  "/classroom",
  authenticate,
  authorize(["Teacher"]),
  async (req, res) => {
    res.json(req.classroom);
  }
);
router.post(
  "/create-timetable",
  authenticate,
  authorize(["Teacher", "Principal"]),
  async (req, res) => {
    const { classroomId, timetable } = req.body;
    try {
      const classroom = await Classroom.findById(classroomId);
     if(!classroom){
      return res.status(403).send('Classroom not found')
     }
     if(!classroom.teacher){
      classroom.teacher= req.user._id
     }
     if(classroom.teacher.toString() !== req.user._id.toString()){
      return res.status(403).send('You do not have the permission to modify classroom')
     }
      const isValidTimetable = timetable.every((period) => {
        return (
          period.startTime >= classroom.startTime &&
          period.endTime <= classroom.endTime
        );
      });

      if (!isValidTimetable) {
        return res.status(400).json({ message: "Invalid timetable periods" });
      }

      classroom.timetable = timetable;
      await classroom.save();
      res.send("Timetable created successfully");
    } catch (err) {
      console.error(err)
      res.status(500).send("Error creating Timetable");
    }
  }
);

// router.post(
//   "/assign-student",
//   authenticate,
//   authorize(["Principal", "Teacher"]),
//   async (req, res) => {
//     const { teacherId, studentIds } = req.body;
//     try {
//       const teacher = await User.findById(teacherId);
//       if (!teacher || teacher.role !== "Teacher")
//         return res.status(404).send("Teacher not found");

//       if (!Array.isArray(studentIds)) {
//         return res.status(400).json({ message: "studentIds must be an array" });
//       }

//       const students = await User.find({
//         _id: { $in: studentIds },
//         role: "Student",
//       });
//       if (students.length !== studentIds.length)
//         return res
//           .status(404)
//           .json({ message: "One or more students not found" });

//       students.forEach(async (student) => {
//         student.teacher = teacherId;
//         await student.save();
//       });
//       res.send("Students assigned to teacher");
//     } catch (err) {
//       res.status(500).send("Error assigning students");
//     }
//   }
// );

export default router;
