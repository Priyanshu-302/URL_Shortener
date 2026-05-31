import React, { useState } from "react";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../components/Toast";
import api from "../lib/api";
import { motion } from "framer-motion";
import { User as UserIcon, Mail, Key, ShieldCheck, ShieldAlert } from "lucide-react";

export const ProfilePage: React.FC = () => {
  const { user, setUser } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim()) {
      setErrorMsg("Name and email are required fields");
      return;
    }

    // Password validation if changing
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        setErrorMsg("Please enter your current password to change it.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("New passwords do not match.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const payload: any = { name, email };
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const response = await api.patch("/api/auth/profile", payload);
      const updatedUser = response.data?.data;

      if (updatedUser) {
        setUser({
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
        });
        showToast("Profile updated successfully!", "success");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.response?.data?.message || err.message || "Failed to update profile";
      setErrorMsg(msg);
      showToast(msg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your personal information and security settings.</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header info */}
            <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
              <div className="w-16 h-16 bg-[#7C3AED]/10 text-[#7C3AED] rounded-full flex items-center justify-center border border-[#7C3AED]/20">
                <UserIcon className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                <p className="text-xs text-gray-400">User ID: {user?._id}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 focus:border-[#7C3AED]"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Email address */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 focus:border-[#7C3AED]"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Password fields */}
            <div className="border-t border-gray-100 pt-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-gray-400" />
                  Change Password
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">Leave blank if you do not wish to modify your password.</p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 block">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 focus:border-[#7C3AED]"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 block">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 focus:border-[#7C3AED]"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 block">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none text-sm text-gray-900 focus:border-[#7C3AED]"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Error alerts */}
            {errorMsg && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700 font-medium">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit */}
            <div className="border-t border-gray-100 pt-6 flex justify-end">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl transition-all shadow-md flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
};
