import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUsers } from "../api";

const StudentDashboard = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [classmates, setClassmates] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { teachers, students } = await getUsers();
        setTeachers(teachers);
        setClassmates(students);

        const currentUserId = localStorage.getItem("userId");
        const currentUser = students.find(
          (student) => student._id === currentUserId
        );
        setStudentProfile(currentUser);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <section className="p-6 min-h-screen my-8">
        <h1 className="text-white mb-4">Welcome to Student Dashboard</h1>
        {error && <p className="error text-red-600 mb-4">{error}</p>}

        {studentProfile && (
          <div className="profile mb-8">
            <h2 className="text-white mb-2">Your Profile</h2>
            <div className="rounded-lg bg-white p-6">
              <p>
                <strong>Name:</strong> {studentProfile.name}
              </p>
              <p>
                <strong>Email:</strong> {studentProfile.email}
              </p>
            </div>
          </div>
        )}

        <section className="students mb-5 flex flex-col gap-4">
          <h2 className="text-white mb-2">Classmates</h2>
          <div className="overflow-x-auto rounded-lg">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-2 px-4 text-left text-gray-600">Name</th>
                  <th className="py-2 px-4 text-left text-gray-600">Email</th>
                </tr>
              </thead>
              <tbody>
                {classmates.map((student) => (
                  <tr key={student._id}>
                    <td className="py-2 px-4">{student.name}</td>
                    <td className="py-2 px-4">{student.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="teachers p-6 min-w-screen mt-8">
          <h2 className="text-white mb-2">Teachers</h2>
          <div className="rounded-lg bg-white p-6">
            <ul className="list-none p-0">
              {teachers.map((teacher) => (
                <li
                  key={teacher._id}
                  className="mb-3 p-4 bg-gray-50 border border-gray-200 rounded-md"
                >
                  <div className="text-lg text-gray-800">{teacher.name}</div>
                  <div className="text-gray-600">{teacher.email}</div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </div>
  );
};

export default StudentDashboard;
