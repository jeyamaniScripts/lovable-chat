import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api/api.js"; // axios instance

const Authentication = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // REGISTER
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }

        await API.post("/", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          pic: formData.pic,
        });

        toast.success("Signup successful. Please login");
        setMode("login"); // redirect to login
      }

      // LOGIN
      if (mode === "login") {
        const { data } = await API.post("/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        toast.success("Login successful");

        navigate("/chats"); // redirect to chats
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-[360px] bg-white rounded-2xl shadow-xl px-8 py-10">
      <h1 className="text-3xl font-semibold text-gray-900">
        {mode === "login" ? "Login" : "Sign up"}
      </h1>

      <p className="text-gray-500 text-sm mt-1">
        Please {mode === "login" ? "sign in" : "sign up"} to continue
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {/* Name */}
        {mode === "register" && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full h-12 px-5 rounded-full border border-gray-300 outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        )}

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full h-12 px-5 rounded-full border border-gray-300 outline-none
            focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full h-12 px-5 pr-14 rounded-full border border-gray-300 outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {/* Confirm Password */}
        {mode === "register" && (
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="w-full h-12 px-5 rounded-full border border-gray-300 outline-none
              focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
        )}

        {/* Forgot password */}
        {mode === "login" && (
          <p className="text-sm text-blue-600 cursor-pointer">
            Forgot password?
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="w-full h-11 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          {mode === "login" ? "Login" : "Sign up"}
        </button>
      </form>

      {/* Switch mode */}
      <p
        onClick={() =>
          setMode((prev) => (prev === "login" ? "register" : "login"))
        }
        className="text-gray-500 text-sm mt-5 text-center cursor-pointer"
      >
        {mode === "login"
          ? "Don't have an account? "
          : "Already have an account? "}
        <span className="text-blue-600 font-medium">
          {mode === "login" ? "Sign up" : "Sign in"}
        </span>
      </p>
    </div>
  );
};

export default Authentication;
