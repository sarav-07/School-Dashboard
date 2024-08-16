import React, { useEffect, useState } from "react";
import {
  assignTeacherToClassroom,
  createClassroom,
  createUsers,
  getClassrooms,
  getUsers,
} from "../api.js";

const PrincipalDashboard = () => {
  const [newUserName, setNewUserName] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [classRoomName, setClassRoomName] = useState("");
  const [classRoomStartTime, setClassRoomStartTime] = useState("");
  const [classRoomEndTime, setClassRoomEndTime] = useState("");
  const [classRoomDays, setClassRoomDays] = useState([]);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("Teacher");

  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsers();
      console.log(data);
      setTeachers(data.teachers);
      setStudents(data.students);
    };
    loadUsers();

    const loadClassrooms = async () => {
      const response = await getClassrooms();
      console.log(response);
      setClassrooms(response.classrooms);
    };
    loadClassrooms();
  }, []);

  const handleCreateClassroom = async () => {
    const classroomData = {
      name: classRoomName,
      startTime: classRoomStartTime,
      endTime: classRoomEndTime,
      days: classRoomDays.split(",").map((day) => day.trim()),
    };
    await createClassroom(classroomData);
    alert("Classroom created successfully");
    setClassRoomName("");
    setClassRoomStartTime("");
    setClassRoomEndTime("");
    setClassRoomDays([]);
  };

  const handleCreateUser = async () => {
    try {
      await createUsers({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      });
      alert(`${newUserRole} account created successfully`);
      setNewUserName("");
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserRole("Teacher");
    } catch (err) {
      console.error("Error creating user:", err.response);
    }
  };

  const handleAssignTeacher = async () => {
    try {
      await assignTeacherToClassroom({
        teacherId: selectedTeacher,
        classroomId: selectedClassroom,
      });
      alert("Teacher assigned to classroom successfully");
      setSelectedTeacher("");
      setSelectedClassroom("");
    } catch (err) {
      console.error(
        "Error assigning teacher:",
        err.response ? err.response.data : err.message
      );
      alert('Failed to assign teacher')
    }
  };

  return (
    <div className="p-6 min-h-screen my-8">
      <h1 className="text-white mb-4">Welcome to Principal Dashboard</h1>
      <section className="mb-10">
        <h2 className="text-white">Teachers</h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg ">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left text-gray-600">Name</th>
                <th className="py-2 px-4 text-left text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher._id}>
                  <td className="py-2 px-4">{teacher.name}</td>
                  <td className="py-2 px-4">{teacher.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mb-10 ">
        <h2 className="text-white mb-2">Students</h2>
        <div className="rounded-lg overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200  ">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-4 text-left text-gray-600">Name</th>
                <th className="py-2 px-4 text-left text-gray-600">Email</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student._id}>
                  <td className="py-2 px-4">{student.name}</td>
                  <td className="className=py-2 px-4">{student.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-white mb-2">Create Classroom</h2>
        <div className="mx-auto rounded-lg bg-white p-6">
          <input
            type="text"
            value={classRoomName}
            onChange={(e) => setClassRoomName(e.target.value)}
            placeholder="Classroom Name"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
          />
          <input
            type="text"
            value={classRoomStartTime}
            onChange={(e) => setClassRoomStartTime(e.target.value)}
            placeholder="Start Time"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
          />
          <input
            type="text"
            value={classRoomEndTime}
            onChange={(e) => {
              setClassRoomEndTime(e.target.value);
            }}
            placeholder="End Time"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
          />
          <input
            type="text"
            value={classRoomDays}
            onChange={(e) => setClassRoomDays(e.target.value)}
            placeholder="Days (e.g Monday,Tuesday)"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
          />
          <button
            className="w-full py-2 px-4 text-white font-semibold rounded-lg mt-4 "
            onClick={handleCreateClassroom}
          >
            Create
          </button>
        </div>
      </section>
      <section>
        <h2 className="text-white mb-2">Create User</h2>
        <div className="bg-white p-6 rounded-lg">
          <input
            type="text"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
            placeholder="Name"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
          />
          <input
            type="text"
            value={newUserEmail}
            onChange={(e) => setNewUserEmail(e.target.value)}
            placeholder="Email"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
          />
          <input
            type="text"
            value={newUserPassword}
            onChange={(e) => setNewUserPassword(e.target.value)}
            placeholder="Password"
            className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
          />
          <div className="mb-4 ">
            <label className="block mb-2 text-gray-600 font-semibold">
              Role
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg  "
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value)}
            >
              <option value="Teacher">Teacher</option>
              <option value="Student">Student</option>
            </select>
          </div>

          <button
            className="w-full py-2 px-4 text-white font-semibold rounded-lg mt-4"
            onClick={handleCreateUser}
          >
            Create User
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-white mb-2">Assign Teacher to Classroom</h2>
        <div className="bg-white p-6 rounded-lg">
          <div className="mb-4">
            <label className="block mb-2 text-gray-600 font-semibold">
              Select Teacher
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
            >
              <option value="">Select a Teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-600 font-semibold">
              Select Classroom
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-lg"
              value={selectedClassroom}
              onChange={(e) => setSelectedClassroom(e.target.value)}
            >
              <option value="">Select a Classroom</option>
              {classrooms.map((classroom) => (
                <option key={classroom._id} value={classroom._id}>
                  {classroom.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className="w-full py-2 px-4 text-white font-semibold rounded-lg mt-4 bg-[#6441a5]"
            onClick={handleAssignTeacher}
            disabled={!selectedTeacher || !selectedClassroom}
          >
            Assign Teacher to Classroom
          </button>
        </div>
      </section>
    </div>
  );
};

export default PrincipalDashboard;
