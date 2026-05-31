import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Shield, LogOut, Menu, X, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isWhiteNavbar = location.pathname === "/dashboard" || location.pathname === "/profile";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className={`w-full z-40 border-b transition-all duration-300 ${
      isWhiteNavbar 
        ? "sticky top-0 bg-white border-gray-100 text-gray-900 shadow-sm" 
        : "absolute top-0 left-0 bg-[#030712]/80 border-white/5 backdrop-blur-md text-white"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              isWhiteNavbar ? "bg-[#7C3AED]/10" : "bg-[#7C3AED]/20 group-hover:bg-[#7C3AED]/35"
            }`}>
              <Shield className="w-5 sm:w-6 h-5 sm:h-6 text-[#7C3AED]" />
            </div>
            <span className={`text-xl sm:text-2xl font-bold tracking-tight transition-colors duration-300 ${
              isWhiteNavbar ? "text-gray-900" : "text-white"
            }`}>
              Secure<span className="text-[#7C3AED]">Link</span>
            </span>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard"
                      ? "text-[#7C3AED] bg-[#7C3AED]/5 px-4 py-2 rounded-xl font-bold" 
                      : isWhiteNavbar
                      ? "text-gray-500 hover:text-gray-900"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>
                {/* Profile Badge Link */}
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-all ${
                    location.pathname === "/profile"
                      ? "border-[#7C3AED] bg-[#7C3AED]/10 text-[#7C3AED]"
                      : isWhiteNavbar
                      ? "border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100"
                      : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <UserIcon className="w-4 h-4 text-[#7C3AED]" />
                  <span className="font-semibold">{user?.name}</span>
                </Link>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                    isWhiteNavbar
                      ? "border-gray-200 hover:bg-gray-50 text-gray-700"
                      : "border-white/10 hover:bg-white/5 text-gray-300 hover:text-white"
                  }`}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 transition-colors"
                >
                  Login
                </Link>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate("/auth")}
                  className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-[#7C3AED]/25"
                >
                  Get started
                </motion.button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg focus:outline-none ${
                isWhiteNavbar ? "text-gray-600 hover:text-gray-900" : "text-gray-400 hover:text-white"
              }`}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className={`md:hidden border-t overflow-hidden ${
              isWhiteNavbar ? "bg-white border-gray-100 text-gray-900" : "bg-[#0A0F1D] border-white/5 text-white"
            }`}
          >
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 border-b text-sm font-semibold ${
                      isWhiteNavbar ? "border-gray-100 text-gray-700 hover:bg-gray-50" : "border-white/5 text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <UserIcon className="w-4 h-4 text-[#7C3AED]" />
                    <span>Logged in as <strong>{user?.name}</strong></span>
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2 rounded-xl text-sm font-medium ${
                      location.pathname === "/dashboard"
                        ? "text-[#7C3AED] bg-[#7C3AED]/5 font-bold"
                        : isWhiteNavbar
                        ? "hover:bg-gray-50 text-gray-700"
                        : "hover:bg-white/5 text-gray-300"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2 text-left rounded-xl text-sm font-medium text-red-500 hover:bg-red-50/50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 p-2">
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="text-center py-2.5 rounded-xl border border-white/10 text-sm font-medium hover:bg-white/5 transition-colors"
                  >
                    Login
                  </Link>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/auth");
                    }}
                    className="py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-center text-sm font-semibold rounded-xl transition-colors shadow-lg"
                  >
                    Get started
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
