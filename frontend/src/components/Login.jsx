import React, { useState } from "react";
import { login } from "../api";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-8 bg-white shadow-md rounded-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Login</h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
              <input
              id="email"
                type="text"
                name="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
              />
            </div>
           <div>
            <label className="block text-gray-700 font-semibold mb-1" htmlFor="">Password</label>
            <input
            id="password"
            name="password"
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5]"
            />
           </div>
            <button className="w-full py-3 mt-6 font-semibold text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6441a5] focus:ring-offset-2" type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
