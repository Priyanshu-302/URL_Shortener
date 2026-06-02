import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/api";
import { KeyRound } from "lucide-react";
import { useToast } from "../components/Toast";

export const VerifyPassword: React.FC = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/api/url/verify-password", { shortCode, password });
      const { redirectUrl } = response.data.data;
      showToast("Access granted! Redirecting...", "success");
      // Perform the redirect to the target URL
      window.location.href = redirectUrl;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Incorrect passcode.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white text-gray-900 border border-gray-100 p-8 rounded-3xl shadow-2xl space-y-6 text-center">
        <div className="p-4 bg-purple-50 text-[#7C3AED] rounded-full w-fit mx-auto border border-purple-100">
          <KeyRound className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-extrabold tracking-tight">Enter Passcode</h2>
          <p className="text-sm text-gray-500">This secure link is password protected.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Type passcode..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-center font-bold tracking-widest text-lg text-gray-950 placeholder:text-sm placeholder:tracking-normal placeholder:font-normal"
            required
            autoFocus
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>Decrypting...</span>
              </>
            ) : (
              <span>Verify & Open Link</span>
            )}
          </button>
        </form>
        <button
          onClick={() => navigate("/")}
          className="text-xs text-gray-400 hover:text-gray-600 font-semibold transition-colors"
          disabled={loading}
        >
          Cancel & Return Home
        </button>
      </div>
    </div>
  );
};
