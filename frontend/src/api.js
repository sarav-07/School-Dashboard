import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const login = async (email, password) => {
  if (!email || !password) {
    console.error("Email or password is missing");
    return;
  }
  try {
    const res = await axios.post(`${API_URL}/login`, { email, password });
    console.log("Login response:", res.data);
    const token = res.data.token;
    localStorage.setItem("token", token);
    return res.data;
  } catch (err) {
    console.error("Login Error:", err.message);
  }
};

export const getUsers = async () => {
  try {
    const res = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (err) {
    console.error("Login error:", err.message);
  }
};

export const getClassrooms = async () => {
  try {
    const res = await axios.get(`${API_URL}/classrooms`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const createUsers = async ({ name, email, password, role }) => {
  try {
    const res = await axios.post(
      `${API_URL}/create-user`,
      { name, email, password, role },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Error creating user:", err);
    throw err;
  }
};

export const createClassroom = async ({ name, startTime, endTime, days }) => {
  try {
    const res = await axios.post(
      `${API_URL}/create-classroom`,
      { name, startTime, endTime, days },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    return res.data;
  } catch (err) {
    console.error("Error creating Classroom", err.response);
  }
};

export const createTimetable = async ({ classroomId, timetable }) => {
  try {
    const res = await axios.post(
      `${API_URL}/create-timetable`,
      { classroomId, timetable },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    return res;
  } catch (err) {
    console.error("Error creating timetable:", err.response);
  }
};

export const assignTeacherToClassroom = async ({ teacherId, classroomId }) => {
  const token = localStorage.getItem("token");
  try {
    const res = await axios.post(
      `${API_URL}/assign-teacher`,
      { teacherId, classroomId },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return res.data;
  } catch (err) {
    console.error(err.response);
    throw err;
  }
};
