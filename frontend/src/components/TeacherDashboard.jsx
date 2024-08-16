import React, { useEffect, useState } from "react";
import { createTimetable, getUsers } from "../api.js";
import { jwtDecode } from "jwt-decode";
import { set } from "mongoose";

const TeacherDashboard = () => {
  const [students, setStudents] = useState([]);
  const [teacherClassroom, setTeacherClassroom] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [newClass, setNewClass] = useState({
    subject: "",
    date: "",
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const teacherId = decodedToken.teacherId;
        const data = await getUsers();
        if (data) {
          const teacher = data.teachers.find(
            (teacher) => teacher._id === teacherId
          );
          if (teacher && teacher.classroomId) {
            setTeacherClassroom(teacher.classroomId);
            setStudents(
              data.students.filter(
                (student) => student.classroomId === teacher.classroomId
              )
            );
          }
        } else {
          setError("No data found");
        }
      } else {
        setError("No token found, please log in again");
      }
    } catch (err) {
      setError("Failed to load data");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTimetableChange = (e) => {
    const { name, value } = e.target;
    setNewClass((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    const startDateTime = `${newClass.date}T${newClass.startTime}`;
    const endDateTime = `${newClass.date}T${newClass.endTime}`;
    setTimetable((previousTimetable) => [
      ...previousTimetable,
      {
        subject: newClass.subject,
        date: newClass.date,
        startTime: startDateTime,
        endTime: endDateTime,
      },
    ]);
    setNewClass({
      subject: "",
      date: "",
      startTime: "",
      endTime: "",
    });
  };

  const handleSaveTimetable = async () => {
    if (!teacherClassroom) {
      setError("No classroom assigned to this teacher");
      return;
    }
    try {
      const response = await createTimetable({
        classroomId: teacherClassroom,
        timetable,
      });
      if (response && response.status === 200) {
        setSuccessMessage("Timetable created successfully");
        setTimetable([]);
      } else {
        setError("Error saving timetable");
      }
    } catch (err) {
      setError("Error saving timetable");
      console.error("Error creating timetable", err);
    }
  };

  return (
    <div>
      <section className="p-6 min-h-screen my-8">
        <h1 className="text-white mb-4">Welcome to Teacher's Dashboard</h1>
        {error && <p className="error text-red-600 mb-4">{error}</p>}
        {successMessage && (
          <p className="success text-green-600 mb-4">{successMessage}</p>
        )}
        <section className="students mb-5 flex flex-col gap-4">
          <h2 className="text-white mb-2">Students</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg ">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-600">Email</th>
                  <th className="py-2 px-4 text-left text-gray-600">Name</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  return (
                    <tr key={student._id}>
                      <td className="py-2 px-4">{student.name}</td>
                      <td className="py-2 px-4">{student.email}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="p-6 min-w-screen mt-8">
          <h2 className="text-white mb-2">Create Timetable</h2>
          <div className=" rounded-lg bg-white p-6">
            <form onSubmit={handleAddClass}>
              <div className="space-y-4">
                <div className="">
                  <label className="block text-gray-600 mb-2 font-semibold">
                    Subject:
                  </label>
                  <input
                    className="w-full mb-3 p-2 border border-gray-300 rounded-lg"
                    type="text"
                    name="subject"
                    value={newClass.subject}
                    onChange={handleTimetableChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-2 font-semibold">
                    Date:
                  </label>
                  <input
                    className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                    type="date"
                    name="date"
                    value={newClass.date}
                    onChange={handleTimetableChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 font-semibold">
                    Start time:
                  </label>
                  <input
                    className="w-full mb-4 p-2 border border-gray-300 rounded-lg"
                    type="time"
                    name="startTime"
                    value={newClass.startTime}
                    onChange={handleTimetableChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-600 mb-2 font-semibold">
                    End time:
                  </label>
                  <input
                    className="ml-2 w-full p-2 rounded-md border-solid border--[#ccc]"
                    type="time"
                    name="endTime"
                    value={newClass.endTime}
                    onChange={handleTimetableChange}
                    required
                  />
                </div>
              </div>
              <button
                className="w-full py-2 px-4 text-white font-semibold rounded-lg mt-4"
                type="submit"
              >
                Add Class
              </button>
            </form>
          </div>
        </section>
        <section className="p-6 min-w-screen my-8">
          <h2 className="text-white mb-2">Time table</h2>
          <div className="rounded-lg bg-white p-6">
            <ul className="list-none p-0">
              {timetable.map((cls, index) => {
                return (
                  <li
                    key={index}
                    className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-md flex justify-between items-center"
                  >
                    <div className="text-lg text-gray-800">{cls.subject}</div>
                    <div>
                      <span className="text-gray-600">
                        {new Date(cls.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -{" "}
                        {new Date(cls.endTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-gray-600">
                        {new Date(cls.startTime).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
            <button
              className="w-full py-2 px-4 text-white font-semibold rounded-lg mt-4"
              onClick={handleSaveTimetable}
            >
              Save Timetable
            </button>
          </div>
        </section>
      </section>
    </div>
  );
};

export default TeacherDashboard;
