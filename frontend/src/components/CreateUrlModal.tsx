import React, { useState, useEffect } from "react";
import { useCreateUrl, useUpdateUrl, type UrlItem } from "../hooks/useUrls";
import { useToast } from "./Toast";
import { createUrlSchema } from "../lib/validators";
import { X, Plus, Mail, ShieldAlert, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CreateUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData: UrlItem | null;
}

export const CreateUrlModal: React.FC<CreateUrlModalProps> = ({ isOpen, onClose, editData }) => {
  const { showToast } = useToast();
  const createMutation = useCreateUrl();
  const updateMutation = useUpdateUrl();

  const [originalUrl, setOriginalUrl] = useState("");
  const [isProtected, setIsProtected] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [authorizedEmails, setAuthorizedEmails] = useState<string[]>([]);
  const [expiresAt, setExpiresAt] = useState("");
  const [maxClicks, setMaxClicks] = useState("");
  const [selfDestruct, setSelfDestruct] = useState(false);
  const [password, setPassword] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<{ originalUrl?: string; emails?: string; customCode?: string }>({});

  const formatDateTimeLocal = (isoString?: string | null) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);
      const tzoffset = date.getTimezoneOffset() * 60000;
      const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
      return localISOTime;
    } catch (e) {
      return "";
    }
  };

  const isEditMode = !!editData;

  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setOriginalUrl(editData.originalUrl);
        setIsProtected(editData.isProtected);
        setAuthorizedEmails(editData.authorizedEmails || []);
        setExpiresAt(formatDateTimeLocal(editData.expiresAt));
        setMaxClicks(editData.maxClicks ? String(editData.maxClicks) : "");
        setSelfDestruct(editData.selfDestruct || false);
        setPassword(editData.password ? "••••••••" : "");
        setCustomCode(editData.shortCode || "");
        setShowAdvanced(
          !!editData.expiresAt || 
          !!editData.maxClicks || 
          !!editData.selfDestruct || 
          !!editData.password
        );
      } else {
        setOriginalUrl("");
        setIsProtected(false);
        setAuthorizedEmails([]);
        setExpiresAt("");
        setMaxClicks("");
        setSelfDestruct(false);
        setPassword("");
        setCustomCode("");
        setShowAdvanced(false);
      }
      setEmailInput("");
      setErrors({});
    }
  }, [isOpen, editData]);

  const handleAddEmail = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();

    if (!cleanEmail) return;

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setErrors((prev) => ({ ...prev, emails: "Invalid email format" }));
      return;
    }

    if (authorizedEmails.includes(cleanEmail)) {
      setErrors((prev) => ({ ...prev, emails: "Email already added" }));
      return;
    }

    setAuthorizedEmails((prev) => [...prev, cleanEmail]);
    setEmailInput("");
    setErrors((prev) => ({ ...prev, emails: undefined }));
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setAuthorizedEmails((prev) => prev.filter((email) => email !== emailToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === " ") {
      e.preventDefault();
      handleAddEmail();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Determine password payload for database update
    let passwordPayload: string | null | undefined = undefined;
    if (isEditMode) {
      if (password === "") {
        passwordPayload = null; // Clear password lock
      } else if (password !== "••••••••") {
        passwordPayload = password; // Set new password
      }
      // If password === "••••••••", it remains undefined so it won't be sent/modified in PATCH
    } else {
      passwordPayload = password || null; // Create mode
    }

    // Local validations for custom code
    if (isEditMode && !customCode.trim()) {
      setErrors((prev) => ({ ...prev, customCode: "Short code alias cannot be empty." }));
      return;
    }

    if (customCode.trim() !== "") {
      const cleanCode = customCode.trim();
      const codeRegex = /^[a-zA-Z0-9-_]+$/;
      if (!codeRegex.test(cleanCode)) {
        setErrors((prev) => ({
          ...prev,
          customCode: "Custom code can only contain letters, numbers, dashes, and underscores."
        }));
        return;
      }
    }

    const formData = {
      originalUrl,
      isProtected,
      authorizedEmails,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      maxClicks: maxClicks ? parseInt(maxClicks, 10) : null,
      selfDestruct,
      password: passwordPayload,
      customCode: !isEditMode && customCode.trim() ? customCode.trim() : undefined,
      shortCode: isEditMode && customCode.trim() ? customCode.trim() : undefined,
    };

    // Run Zod validation
    const validation = createUrlSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: { originalUrl?: string; emails?: string; customCode?: string } = {};
      validation.error.issues.forEach((err) => {
        if (err.path.includes("originalUrl")) {
          fieldErrors.originalUrl = err.message;
        }
        if (err.path.includes("customCode") || err.path.includes("shortCode")) {
          fieldErrors.customCode = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      if (isEditMode && editData) {
        await updateMutation.mutateAsync({
          id: editData._id,
          originalUrl,
          isProtected,
          authorizedEmails,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
          maxClicks: maxClicks ? parseInt(maxClicks, 10) : null,
          selfDestruct,
          password: passwordPayload,
          shortCode: customCode.trim(),
        });
        showToast("URL updated successfully", "success");
      } else {
        await createMutation.mutateAsync(formData);
        showToast("Short link created successfully", "success");
      }
      onClose();
    } catch (err: any) {
      const errMsg = err.response?.data?.message || err.message || "Failed to submit form";
      showToast(errMsg, "error");
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 overflow-hidden z-10 pointer-events-auto max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditMode ? "Edit Shortened URL" : "Shorten New URL"}
              </h2>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1 scrollbar-thin">
              {/* Original URL Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700">Original URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/very/long/path"
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border outline-none text-gray-900 placeholder:text-gray-400 transition-all text-sm ${
                    errors.originalUrl
                      ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                      : "border-gray-200 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20"
                  }`}
                  disabled={isSubmitting}
                />
                {errors.originalUrl && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {errors.originalUrl}
                  </p>
                )}
              </div>

              {/* Custom Alias Field */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center justify-between">
                  <span>Custom Alias {!isEditMode && <span className="text-gray-400 font-normal">(Optional)</span>}</span>
                  <span className="text-xs text-gray-400 font-normal">Alphanumeric, dashes & underscores</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-gray-400 font-semibold text-sm pointer-events-none select-none">
                    /
                  </div>
                  <input
                    type="text"
                    placeholder={isEditMode ? "alias" : "custom-alias (auto-generated if empty)"}
                    value={customCode}
                    onChange={(e) => {
                      setCustomCode(e.target.value.replace(/\s+/g, ""));
                      setErrors((prev) => ({ ...prev, customCode: undefined }));
                    }}
                    className={`w-full pl-7 pr-4 py-3 rounded-xl border outline-none text-gray-900 placeholder:text-gray-400 transition-all text-sm ${
                      errors.customCode
                        ? "border-red-300 focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
                        : "border-gray-200 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20"
                    }`}
                    disabled={isSubmitting}
                  />
                </div>
                {errors.customCode && (
                  <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {errors.customCode}
                  </p>
                )}
              </div>

              {/* Public/Protected Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="space-y-0.5 pr-4">
                  <span className="text-sm font-bold text-gray-900">Privacy Lock</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Protect access behind verification emails. Only allowed visitors can open this URL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsProtected(!isProtected)}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    isProtected ? "bg-[#7C3AED]" : "bg-gray-200"
                  }`}
                  disabled={isSubmitting}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      isProtected ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Expanding Protected Sections */}
              <AnimatePresence initial={false}>
                {isProtected && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <Mail className="w-4 h-4 text-gray-400" />
                        Authorized Emails
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="visitor@domain.com"
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                            setErrors((prev) => ({ ...prev, emails: undefined }));
                          }}
                          onKeyDown={handleKeyDown}
                          className={`flex-grow px-4 py-2.5 rounded-xl border outline-none text-gray-900 placeholder:text-gray-400 transition-all text-sm ${
                            errors.emails
                              ? "border-red-300 focus:border-red-500"
                              : "border-gray-200 focus:border-[#7C3AED]"
                          }`}
                          disabled={isSubmitting}
                        />
                        <button
                          type="button"
                          onClick={() => handleAddEmail()}
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-bold flex items-center gap-1 transition-colors"
                          disabled={isSubmitting}
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </button>
                      </div>
                      {errors.emails && (
                        <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3" />
                          {errors.emails}
                        </p>
                      )}

                      {/* Emails Chips Grid */}
                      <div className="flex flex-wrap gap-1.5 pt-2 max-h-32 overflow-y-auto">
                        {authorizedEmails.length === 0 ? (
                          <span className="text-xs text-gray-400 italic">No email constraints. Anyone typing their email can request access.</span>
                        ) : (
                          authorizedEmails.map((email) => (
                            <span
                              key={email}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-xs font-medium"
                            >
                              <span>{email}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveEmail(email)}
                                className="text-purple-400 hover:text-purple-600 transition-colors"
                                disabled={isSubmitting}
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsible Advanced Settings */}
              <div className="border-t border-gray-100 pt-4 space-y-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-left text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <span>Advanced Settings (Expiry & Limits)</span>
                  <span className="text-xs text-[#7C3AED] hover:underline font-bold">
                    {showAdvanced ? "Hide options" : "Show options"}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {showAdvanced && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden space-y-4 pt-1"
                    >
                      {/* Expiration Date/Time */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Link Expiration Date & Time</label>
                        <input
                          type="datetime-local"
                          value={expiresAt}
                          onChange={(e) => setExpiresAt(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-gray-900 placeholder:text-gray-400 transition-all text-sm"
                          disabled={isSubmitting}
                        />
                        <p className="text-[11px] text-gray-400">Leave blank for infinite lifetime.</p>
                      </div>

                      {/* Click Limit */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Maximum Click Limit</label>
                        <input
                          type="number"
                          min="1"
                          placeholder="e.g. 5"
                          value={maxClicks}
                          onChange={(e) => setMaxClicks(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-gray-900 placeholder:text-gray-400 transition-all text-sm"
                          disabled={isSubmitting}
                        />
                        <p className="text-[11px] text-gray-400">The link will deactivate after reaching this count.</p>
                      </div>

                      {/* Password Protection */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Password Lock</label>
                        <input
                          type="text"
                          placeholder="Type password (leave blank for no lock)"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-gray-900 placeholder:text-gray-400 transition-all text-sm font-sans"
                          disabled={isSubmitting}
                        />
                        {isEditMode && editData?.password && (
                          <p className="text-[11px] text-purple-600 font-medium">
                            Lock is active. Clear input to remove, or type to set a new password.
                          </p>
                        )}
                        {(!isEditMode || !editData?.password) && (
                          <p className="text-[11px] text-gray-400">Forces visitors to enter this passcode before redirecting.</p>
                        )}
                      </div>

                      {/* Self-Destruct Toggle */}
                      <div className="flex items-center justify-between p-3.5 bg-amber-50/50 rounded-xl border border-amber-100">
                        <div className="space-y-0.5 pr-4">
                          <span className="text-xs font-bold text-amber-900">Self-Destruct Link</span>
                          <p className="text-[11px] text-amber-600 leading-normal">
                            Deactivate this link automatically after the first successful access.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelfDestruct(!selfDestruct)}
                          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                            selfDestruct ? "bg-amber-600" : "bg-gray-200"
                          }`}
                          disabled={isSubmitting}
                        >
                          <span
                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              selfDestruct ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-xl transition-all shadow-md shadow-[#7C3AED]/20 flex items-center gap-1.5 disabled:opacity-75"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isEditMode ? "Update Link" : "Create Link"}</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
