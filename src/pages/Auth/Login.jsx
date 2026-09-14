
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { Mail, Lock, ArrowRight, LogIn } from "lucide-react";

import { auth } from "../../firebase/firebase.init";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      // Firebase Login
      const result = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      console.log("Logged In User:", result.user);

      // Redirect to originally requested page
      const from = location.state?.from?.pathname || "/";

      navigate(from, { replace: true });

    } catch (error) {
      console.error("Login Error:", error);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setError("Invalid email or password.");
      } else if (error.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4">

      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl border border-emerald-100 shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">

        {/* Glow Background */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="absolute -bottom-16 -right-16 w-36 h-36 bg-teal-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Title */}
        <div className="text-center mb-8 relative z-10">

          <div className="w-12 h-12 bg-emerald-100 text-[#163A2D] rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-200 shadow-inner">

            <LogIn className="w-6 h-6" />

          </div>

          <h2 className="text-3xl font-extrabold text-[#163A2D] font-['Playfair_Display',serif]">
            Welcome Back
          </h2>

          <p className="text-zinc-500 text-sm mt-1">
            Sign in to manage your account
          </p>

        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 relative z-10"
        >

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Email Field */}
          <div>

            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
              Email Address
            </label>

            <div className="relative">

              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70" />

              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="example@domain.com"
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-800 text-sm transition-all"
              />

            </div>

          </div>

          {/* Password Field */}
          <div>

            <div className="flex items-center justify-between mb-2">

              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600">
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                Forgot?
              </Link>

            </div>

            <div className="relative">

              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70" />

              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-800 text-sm transition-all"
              />

            </div>

          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 px-6 bg-[#163A2D] hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >

            <span>
              {isLoading ? "Logging In..." : "Log In"}
            </span>

            {!isLoading && (
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            )}

          </button>

        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500 mt-6 relative z-10">

          Don't have an account?{" "}

          <Link
            to="/register"
            className="text-emerald-700 font-bold hover:underline"
          >
            Register Now
          </Link>

        </p>

      </div>

    </div>
  );
};

export default Login;