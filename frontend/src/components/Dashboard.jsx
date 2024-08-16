import React from "react";
import PrincipalDashboard from "./PrincipalDashboard";
import TeacherDashboard from "./TeacherDashboard";
import { Navigate } from "react-router-dom";
import StudentDashboard from "./StudentDashboard";

const Dashboard = () => {
  const role = localStorage.getItem("role");

  if (role === "Principal") {
    return <PrincipalDashboard />;
  } else if (role === "Teacher") {
    return <TeacherDashboard />;
  } else if (role === "Student") {
    return <StudentDashboard />;
  } else {
    return <Navigate to="/" />;
  }
};

export default Dashboard;
