import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, ShieldAlert, Sparkles, Home } from "lucide-react";

export const VerifyAccess: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setStatus("error");
        setErrorMessage("Access token is missing.");
        return;
      }

      try {
        // Backend verification route: GET /api/access/verify/:token
        // Returns ApiResponse containing { redirectUrl: originalUrl }
        const response = await api.get(`/api/access/verify/${token}`);
        const url = response.data?.data?.redirectUrl;

        if (url) {
          setRedirectUrl(url);
          setStatus("success");
          showToast("Access authorized! Redirecting...", "success");

          // Redirect after 1.5s
          setTimeout(() => {
            window.location.href = url;
          }, 1500);
        } else {
          throw new Error("Unable to determine redirection URL.");
        }
      } catch (err: any) {
        console.error(err);
        const msg = err.response?.data?.message || err.message || "Invalid or expired token.";
        setErrorMessage(msg);
        setStatus("error");
        showToast(msg, "error");
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full filter blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-8 text-gray-900 shadow-2xl relative z-10 text-center"
      >
        <AnimatePresence mode="wait">
          {status === "verifying" && (
            /* Verifying Spinner */
            <motion.div
              key="verifying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 py-6"
            >
              <div className="relative w-16 h-16 mx-auto">
                <div className="w-16 h-16 border-4 border-[#7C3AED]/20 border-t-[#7C3AED] rounded-full animate-spin"></div>
                <div className="absolute inset-2 border border-[#7C3AED]/10 rounded-full animate-pulse"></div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-gray-900">Checking Authorization</h2>
                <p className="text-sm text-gray-400">Verifying magic link credentials on SecureLink...</p>
              </div>
            </motion.div>
          )}

          {status === "success" && (
            /* Verification success checkmark & animation */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 py-4"
            >
              <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full w-fit mx-auto relative">
                <ShieldCheck className="w-10 h-10" />
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute -top-1 -right-1 text-emerald-400"
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Access Granted!</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Authentication confirmed. We are redirecting you to:
                  <br />
                  <span className="text-gray-700 font-mono text-xs break-all underline select-all">{redirectUrl}</span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
                <span className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-ping"></span>
                <span>Transferring connection...</span>
              </div>
            </motion.div>
          )}

          {status === "error" && (
            /* Expired / Invalid state */
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 py-4"
            >
              <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-full w-fit mx-auto">
                <ShieldAlert className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Verification Failed</h3>
                <p className="text-sm text-red-600 font-medium bg-red-50 py-2 px-3 rounded-xl border border-red-100 max-w-xs mx-auto break-words">
                  {errorMessage || "This magic link has expired or is invalid."}
                </p>
                <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed pt-1">
                  Access links are single-use and expire 15 minutes after generation. Try requesting a new link.
                </p>
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl transition-colors w-full flex items-center justify-center gap-2 shadow-md"
              >
                <Home className="w-4 h-4" />
                Return to Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
