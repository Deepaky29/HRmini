import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/Api";

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/api/auth/register", form);
      navigate("/login", { replace: true });
      alert("Signup successful! Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-100 to-pink-100">
      <form className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-extrabold text-gray-800 text-center">
          Create Account
        </h2>
        <p className="text-center text-gray-500">
          Sign up to get started
        </p>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
          required
        />

        <button
          type="submit"
          className="bg-purple-500 text-white py-3 rounded-lg font-semibold w-full hover:bg-purple-600 transition"
        >
          Signup
        </button>

        <p className="text-center text-gray-400 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-indigo-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;
