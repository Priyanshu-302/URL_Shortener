import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import api from "../lib/api";
import { signupSchema, loginSchema } from "../lib/validators";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [isSignIn, setIsSignIn] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // Input states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const handleToggle = () => {
    setIsSignIn(!isSignIn);
    setErrors({});
    setApiError("");
    setPassword("");
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");
    setIsLoading(true);

    const formData = isSignIn ? { email, password } : { name, email, password };
    const schema = isSignIn ? loginSchema : signupSchema;

    const validation = schema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: typeof errors = {};
      validation.error.issues.forEach((err) => {
        const field = err.path[0] as "name" | "email" | "password";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setIsLoading(false);
      return;
    }

    try {
      if (isSignIn) {
        // Sign In Request
        const response = await api.post("/api/auth/login", { email, password });
        // Expected login schema: data.safeData: { user, accessToken, refreshToken }
        // Let's verify structure: response.data.data.safeData
        const { safeData } = response.data?.data || {};
        if (safeData) {
          login(
            { _id: safeData._id, name: safeData.name, email: safeData.email },
            safeData.accessToken,
            safeData.refreshToken
          );
          showToast("Welcome back!", "success");
          navigate("/dashboard");
        } else {
          throw new Error("Invalid payload format received");
        }
      } else {
        // Sign Up Request
        await api.post("/api/auth/signup", { name, email, password });
        showToast("Account created successfully!", "success");

        // Auto-login after successful registration
        const loginRes = await api.post("/api/auth/login", { email, password });
        const { safeData } = loginRes.data?.data || {};
        if (safeData) {
          login(
            { _id: safeData._id, name: safeData.name, email: safeData.email },
            safeData.accessToken,
            safeData.refreshToken
          );
          navigate("/dashboard");
        } else {
          // If login fails, redirect to sign-in panel
          setIsSignIn(true);
        }
      }
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "An authentication error occurred.";
      setApiError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#7C3AED]/10 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-950/15 rounded-full filter blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl relative z-10"
      >
        {/* App Logo */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="p-3 bg-[#7C3AED]/20 rounded-2xl border border-[#7C3AED]/30">
            <Shield className="w-8 h-8 text-[#7C3AED]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Secure<span className="text-[#7C3AED]">Link</span>
          </h1>
          <p className="text-xs text-gray-500">Share links. Control who clicks.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-black/40 rounded-xl mb-6 relative">
          <button
            onClick={() => !isLoading && handleToggle()}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all relative z-10 ${
              isSignIn ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            disabled={isLoading}
          >
            Sign In
          </button>
          <button
            onClick={() => !isLoading && handleToggle()}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all relative z-10 ${
              !isSignIn ? "text-white" : "text-gray-400 hover:text-white"
            }`}
            disabled={isLoading}
          >
            Sign Up
          </button>
          {/* Animated Indicator */}
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute top-1 bottom-1 left-1 bg-[#7C3AED] rounded-lg shadow-md"
            style={{ width: "calc(50% - 4px)" }}
            animate={{ x: isSignIn ? 0 : "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
          />
        </div>

        {/* Auth Forms with AnimatePresence */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignIn ? "signin" : "signup"}
              initial={{ x: isSignIn ? -30 : 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isSignIn ? 30 : -30, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Name Field (Sign Up Only) */}
              {!isSignIn && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400">Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 bg-black/40 border rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] transition-colors text-white ${
                      errors.name ? "border-red-500/50" : "border-white/5"
                    }`}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Email Address</label>
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 bg-black/40 border rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] transition-colors text-white ${
                    errors.email ? "border-red-500/50" : "border-white/5"
                  }`}
                  disabled={isLoading}
                />
                {errors.email && <p className="text-xs text-red-400">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-400">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-3 bg-black/40 border rounded-xl text-sm focus:outline-none focus:border-[#7C3AED] transition-colors text-white pr-10 ${
                      errors.password ? "border-red-500/50" : "border-white/5"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400">{errors.password}</p>}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* API Error Box */}
          {apiError && (
            <div className="flex items-start gap-2 p-3 bg-red-950/20 border border-red-500/30 rounded-xl text-xs text-red-400 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{apiError}</span>
            </div>
          )}

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#7C3AED]/25 mt-4 flex items-center justify-center gap-2"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Please wait...</span>
              </>
            ) : (
              <span>{isSignIn ? "Sign In" : "Sign Up"}</span>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};
