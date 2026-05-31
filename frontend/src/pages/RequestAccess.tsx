import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";
import api from "../lib/api";
import { requestAccessSchema } from "../lib/validators";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Mail, ShieldAlert, ArrowLeft, Send } from "lucide-react";

export const RequestAccess: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validation = requestAccessSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      // Endpoint body: { shortCode, email }
      await api.post("/api/access/request", {
        shortCode,
        email,
      });

      setIsSuccess(true);
      showToast("Access magic link request dispatched", "success");
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || err.message || "Request failed.";
      setError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background radial effects */}
      <div className="absolute w-[400px] h-[400px] bg-[#7C3AED]/10 rounded-full filter blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-md bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 text-gray-900 shadow-2xl relative z-10"
      >
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            /* Request Entry Form */
            <motion.div
              key="request-form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Header Icon */}
              <div className="flex flex-col items-center text-center gap-3">
                <div className="p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] rounded-full w-fit">
                  <Lock className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Protected Link</h2>
                  <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                    Access to <strong>/{shortCode}</strong> requires email authorization. Enter your email to request a magic link.
                  </p>
                </div>
              </div>

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                    <input
                      type="email"
                      placeholder="visitor@domain.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      className={`w-full pl-9 pr-4 py-3 border rounded-xl outline-none text-sm text-gray-900 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all ${
                        error ? "border-red-300" : "border-gray-200"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                      <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{error}</span>
                    </p>
                  )}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#7C3AED]/25 flex items-center justify-center gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Request Access Link</span>
                    </>
                  )}
                </motion.button>
              </form>

              {/* Footer */}
              <button
                onClick={() => navigate("/")}
                className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1 pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Go Back Home
              </button>
            </motion.div>
          ) : (
            /* Success confirmation screen */
            <motion.div
              key="request-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="p-4 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full w-fit mx-auto relative">
                <Mail className="w-8 h-8 animate-bounce" />
                {/* Micro-animations Sparkles */}
                <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-extrabold text-gray-900">Check Your Inbox!</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We've sent a magic validation link to:
                  <br />
                  <strong className="text-gray-900 break-all">{email}</strong>
                </p>
              </div>
              <div className="p-4 bg-purple-50 text-purple-700 text-xs font-semibold rounded-xl leading-relaxed border border-purple-100">
                🔒 Click the link in your email to automatically gain entry and bypass verification.
              </div>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/")}
                className="px-6 py-2.5 bg-gray-950 hover:bg-gray-800 text-white text-xs font-bold rounded-xl transition-colors w-full"
              >
                Return to Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
