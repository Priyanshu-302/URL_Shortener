import React, { useState, useEffect } from "react";
import { Navbar } from "../components/Navbar";
import { UrlCard } from "../components/UrlCard";
import { CreateUrlModal } from "../components/CreateUrlModal";
import { QrCodeModal } from "../components/QrCodeModal";
import { useUrls, useDeleteUrl, type UrlItem } from "../hooks/useUrls";
import { useToast } from "../components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Link2, Lock, Globe, BarChart2, Search, RefreshCw, ShieldAlert } from "lucide-react";

// CountUp animator
const CountUp: React.FC<{ value: number }> = ({ value }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }

    const duration = 1000; // 1 second duration
    const stepTime = Math.max(Math.floor(duration / end), 16); // cap step time at 16ms (~60fps)

    const timer = setInterval(() => {
      start += Math.max(Math.ceil(end / (duration / stepTime)), 1);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count.toLocaleString()}</>;
};

export const Dashboard: React.FC = () => {
  const { showToast } = useToast();
  const { data: urls = [], isLoading, isError, refetch, isRefetching } = useUrls();
  const deleteMutation = useDeleteUrl();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "public" | "protected">("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUrl, setEditingUrl] = useState<UrlItem | null>(null);
  const [activeQrUrl, setActiveQrUrl] = useState<UrlItem | null>(null);

  // Stats derivation
  const totalUrls = urls.length;
  const publicUrls = urls.filter((u) => !u.isProtected).length;
  const protectedUrls = urls.filter((u) => u.isProtected).length;
  const totalClicks = urls.reduce((sum, u) => sum + (u.clicks || 0), 0);

  const handleEditClick = (url: UrlItem) => {
    setEditingUrl(url);
    setIsModalOpen(true);
  };

  const handleCreateClick = () => {
    setEditingUrl(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      showToast("URL deleted successfully", "success");
    } catch (err: any) {
      showToast(err.message || "Failed to delete URL", "error");
    }
  };

  // Search & Filter filter logic
  const filteredUrls = urls.filter((url) => {
    const matchesSearch =
      url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      url.shortCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterType === "all" ||
      (filterType === "public" && !url.isProtected) ||
      (filterType === "protected" && url.isProtected);
    return matchesSearch && matchesFilter;
  });

  // Stagger variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-gray-900 pb-20">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Short Links</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your shortened URLs in real time.</p>
          </div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#7C3AED]/20 transition-all ml-0"
          >
            <Plus className="w-4 h-4" />
            Create URL
          </button>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Links */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-[#7C3AED]/10 rounded-xl text-[#7C3AED] border border-[#7C3AED]/20 shrink-0">
              <Link2 className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Links</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {isLoading ? "0" : <CountUp value={totalUrls} />}
              </span>
            </div>
          </div>

          {/* Card 2: Public Links */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl shrink-0">
              <Globe className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Public</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {isLoading ? "0" : <CountUp value={publicUrls} />}
              </span>
            </div>
          </div>

          {/* Card 3: Protected Links */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 border border-purple-100 rounded-xl shrink-0">
              <Lock className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Protected</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {isLoading ? "0" : <CountUp value={protectedUrls} />}
              </span>
            </div>
          </div>

          {/* Card 4: Total Clicks */}
          <div className="bg-white border border-gray-100 p-5 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 border border-blue-100 rounded-xl shrink-0">
              <BarChart2 className="w-5 sm:w-6 h-5 sm:h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-gray-400 block uppercase tracking-wider">Total Clicks</span>
              <span className="text-xl sm:text-2xl font-extrabold text-gray-900">
                {isLoading ? "0" : <CountUp value={totalClicks} />}
              </span>
            </div>
          </div>
        </div>

        {/* Filter / Search Controls */}
        <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search original URL or shortcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 outline-none text-sm text-gray-900 focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Filters & Refresh */}
          <div className="flex w-full md:w-auto items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto">
            {/* Filter Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl items-center border border-gray-200 text-xs font-semibold text-gray-500">
              <button
                onClick={() => setFilterType("all")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === "all" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("public")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === "public" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setFilterType("protected")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  filterType === "protected" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
                }`}
              >
                Protected
              </button>
            </div>

            {/* Manual Refetch */}
            <button
              onClick={() => refetch()}
              className="p-2.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all"
              disabled={isLoading || isRefetching}
              title="Refetch URL list"
            >
              <RefreshCw className={`w-4 h-4 ${isRefetching ? "animate-spin text-[#7C3AED]" : ""}`} />
            </button>
          </div>
        </div>

        {/* URLs List Container */}
        {isLoading ? (
          /* Skeletons */
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white border border-gray-100 p-6 rounded-2xl animate-pulse flex flex-col gap-3">
                <div className="flex gap-2">
                  <div className="w-16 h-6 bg-gray-200 rounded-md"></div>
                  <div className="w-20 h-6 bg-gray-200 rounded-md"></div>
                </div>
                <div className="w-3/4 h-4 bg-gray-200 rounded-md"></div>
              </div>
            ))}
          </div>
        ) : isError ? (
          /* Error State */
          <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-center max-w-md mx-auto space-y-3">
            <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
            <h3 className="text-lg font-bold text-red-950">Failed to load URLs</h3>
            <p className="text-sm text-red-700">Could not retrieve links from the backend server.</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Retry Connection
            </button>
          </div>
        ) : filteredUrls.length === 0 ? (
          /* Empty State */
          <div className="p-12 bg-white border border-gray-100 rounded-3xl text-center max-w-md mx-auto space-y-4 shadow-sm">
            <div className="p-4 bg-[#7C3AED]/5 text-[#7C3AED] rounded-full w-fit mx-auto border border-[#7C3AED]/10">
              <Link2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">No short links found</h3>
              <p className="text-sm text-gray-400 mt-1 leading-relaxed">
                {searchQuery || filterType !== "all"
                  ? "Try checking your search terms or filters."
                  : "Get started by generating your first secure, privacy-controlled short URL."}
              </p>
            </div>
            {!(searchQuery || filterType !== "all") && (
              <button
                onClick={handleCreateClick}
                className="px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl shadow-md transition-colors"
              >
                Generate First Link
              </button>
            )}
          </div>
        ) : (
          /* Actual List */
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredUrls.map((url) => (
                <motion.div key={url._id} variants={itemVariants} layoutId={url._id}>
                  <UrlCard
                    url={url}
                    onEdit={handleEditClick}
                    onDelete={handleDelete}
                    onQrCode={setActiveQrUrl}
                    isDeleting={deleteMutation.isPending}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Floating Add Button bottom right */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleCreateClick}
        className="fixed bottom-6 right-6 z-30 p-4 bg-[#7C3AED] hover:bg-[#6D28D9] text-white rounded-full shadow-xl shadow-[#7C3AED]/30 transition-all border border-[#7C3AED]/20 focus:outline-none block md:hidden"
        title="Shorten new link"
      >
        <Plus className="w-6 h-6" />
      </motion.button>

      {/* Create / Edit Modal Dialog */}
      <CreateUrlModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editData={editingUrl}
      />

      {/* QR Code Modal Dialog */}
      <QrCodeModal
        urlItem={activeQrUrl}
        onClose={() => setActiveQrUrl(null)}
      />
    </div>
  );
};
