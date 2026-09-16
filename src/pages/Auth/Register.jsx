import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { User, Mail, Lock, ArrowRight, Sparkles, KeyRound, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../firebase/firebase.init";
import useAxiosPublic from "../../hook/useAxiosSecure"; // আপনার Axios পাবলিক কাস্টম হুক ইম্পোর্ট করুন

const Register = () => {
  const navigate = useNavigate();
  const axiosPublic = useAxiosPublic();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setError("");

    try {
      // 1. Create Firebase account
      const result = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // 2. Save user's full name in Firebase Profile
      await updateProfile(result.user, {
        displayName: data.fullName,
      });

      // 3. Prepare User Data for Database
      const newUser = {
        uid: result.user.uid,
        fullName: data.fullName,
        email: data.email,
        role: "user", // Default role
        createdAt: new Date().toISOString(),
      };

      // 4. Save User Data to Database via Axios Instance
      const res = await axiosPublic.post("/users", newUser);

      if (res.data.insertedId || res.status === 200 || res.status === 201) {
        // 5. Redirect to login page on success
        navigate("/login", { replace: true });
      }
    } catch (err) {
      console.error("Registration Error:", err);
      
      // Firebase specific error messages
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err.code === "auth/weak-password") {
        setError("Password must be at least 6 characters.");
      } else {
        // Axios error handling or generic error fallback
        setError(
          err.response?.data?.message || 
          err.message || 
          "Registration failed. Please try again."
        );
      }
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-xl border border-emerald-100 shadow-2xl rounded-3xl p-6 sm:p-10 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-teal-200/50 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Join the Community
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#163A2D] font-['Playfair_Display',serif]">
            Create Account
          </h2>

          <p className="text-zinc-500 text-sm mt-2">
            Fill in your details below to set up your account
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 relative z-10"
          noValidate
        >
          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
              Full Name
            </label>

            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70" />

              <input
                type="text"
                placeholder="Ramen Kumar Das"
                {...register("fullName", {
                  required: "Full name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-800 text-sm transition-all"
              />
            </div>

            {errors.fullName && (
              <p className="text-red-500 text-xs font-semibold mt-1 ml-1">
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
              Email Address
            </label>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70" />

              <input
                type="email"
                placeholder="example@domain.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Enter a valid email address",
                  },
                })}
                className="w-full pl-12 pr-4 py-3 bg-white/90 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-800 text-sm transition-all"
              />
            </div>

            {errors.email && (
              <p className="text-red-500 text-xs font-semibold mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Passwords Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70" />

                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full pl-12 pr-4 py-3 bg-white/90 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-800 text-sm transition-all"
                />
              </div>

              {errors.password && (
                <p className="text-red-500 text-xs font-semibold mt-1 ml-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600/70" />

                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === passwordValue || "Passwords do not match",
                  })}
                  className="w-full pl-12 pr-4 py-3 bg-white/90 border border-emerald-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-zinc-800 text-sm transition-all"
                />
              </div>

              {errors.confirmPassword && (
                <p className="text-red-500 text-xs font-semibold mt-1 ml-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 py-3.5 px-6 bg-[#163A2D] hover:bg-emerald-900 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Registering...</span>
              </>
            ) : (
              <>
                <span>Register Account</span>
                <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-zinc-500 mt-6 relative z-10">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-emerald-700 font-bold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;