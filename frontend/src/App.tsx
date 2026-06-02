import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { LandingPage } from "./pages/LandingPage";
import { AuthPage } from "./pages/AuthPage";
import { Dashboard } from "./pages/Dashboard";
import { RequestAccess } from "./pages/RequestAccess";
import { VerifyAccess } from "./pages/VerifyAccess";
import { VerifyPassword } from "./pages/VerifyPassword";
import { ProfilePage } from "./pages/ProfilePage";
import { BioBuilder } from "./pages/BioBuilder";
import { PublicBio } from "./pages/PublicBio";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useToast } from "./components/Toast";
import api from "./lib/api";
import { ShieldAlert } from "lucide-react";
import "./App.css";

// Page Transition wrapper using Framer Motion
const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full min-h-screen"
    >
      {children}
    </motion.div>
  );
};

// Catch-all route component to resolve and handle public/protected short links
const RedirectHandler: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [status, setStatus] = useState<"checking" | "error">("checking");
  const [errorMsg, setErrorMsg] = useState("");
  const [errorTitle, setErrorTitle] = useState("Link Not Found");

  useEffect(() => {
    const checkCode = async () => {
      try {
        const response = await api.get(`/api/url/check/${shortCode}`);
        const { isProtected, isPasswordProtected } = response.data?.data || {};

        if (isPasswordProtected) {
          // Redirect to password entry page
          navigate(`/password/${shortCode}`, { replace: true });
        } else if (isProtected) {
          // Redirect to access request email portal
          navigate(`/access/${shortCode}`, { replace: true });
        } else {
          // Direct public forwarder (triggers click tracking on backend)
          window.location.href = `https://url-shortener-backend-mztz.onrender.com/${shortCode}`;
        }
      } catch (err: any) {
        console.error(err);
        setStatus("error");
        if (err.response?.status === 410) {
          setErrorTitle("Link Expired / Inactive");
        } else {
          setErrorTitle("Link Not Found");
        }
        setErrorMsg(err.response?.data?.message || "This shortened link is invalid or has expired.");
        showToast("Failed to fetch link details.", "error");
      }
    };

    checkCode();
  }, [shortCode, navigate, showToast]);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin"></div>
          <p className="text-sm text-gray-400 font-semibold">Verifying secure link status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-gray-100 p-8 rounded-3xl text-center text-gray-900 shadow-2xl space-y-6">
        <div className="p-4 bg-red-50 text-red-500 rounded-full w-fit mx-auto border border-red-100">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight font-sans">{errorTitle}</h2>
          <p className="text-sm text-red-600 bg-red-50 border border-red-100 py-2 px-3 rounded-xl max-w-xs mx-auto leading-relaxed break-words font-medium">
            {errorMsg}
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl transition-all shadow-md w-full"
        >
          Return Home
        </button>
      </div>
    </div>
  );
};

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <PageTransition>
                <LandingPage />
              </PageTransition>
            }
          />

          {/* Auth Screen */}
          <Route
            path="/auth"
            element={
              <PageTransition>
                <AuthPage />
              </PageTransition>
            }
          />

          {/* Dashboard Portal (Protected Route) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Profile Page (Protected Route) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ProfilePage />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Request Access email validation page */}
          <Route
            path="/access/:shortCode"
            element={
              <PageTransition>
                <RequestAccess />
              </PageTransition>
            }
          />

          {/* Magic Link verification page */}
          <Route
            path="/access/verify/:token"
            element={
              <PageTransition>
                <VerifyAccess />
              </PageTransition>
            }
          />

          {/* Password verification gate */}
          <Route
            path="/password/:shortCode"
            element={
              <PageTransition>
                <VerifyPassword />
              </PageTransition>
            }
          />

          {/* Bio Page Builder Studio */}
          <Route
            path="/bio-builder"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <BioBuilder />
                </PageTransition>
              </ProtectedRoute>
            }
          />

          {/* Public Bio Page */}
          <Route
            path="/bio/:username"
            element={
              <PageTransition>
                <PublicBio />
              </PageTransition>
            }
          />

          {/* Root-level wildcard catcher for checking/redirecting shortened links */}
          <Route
            path="/:shortCode"
            element={
              <PageTransition>
                <RedirectHandler />
              </PageTransition>
            }
          />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
