import React from "react";
import { type UrlItem } from "../hooks/useUrls";
import { useToast } from "./Toast";
import { motion } from "framer-motion";
import { Calendar, Copy, Edit, Trash, Lock, Globe, ExternalLink, BarChart3 } from "lucide-react";

interface UrlCardProps {
  url: UrlItem;
  onEdit: (url: UrlItem) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const UrlCard: React.FC<UrlCardProps> = ({ url, onEdit, onDelete, isDeleting }) => {
  const { showToast } = useToast();

  const handleCopy = async () => {
    const fullShortUrl = `${window.location.origin}/${url.shortCode}`;
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      showToast(`Copied short link: ${url.shortCode}`, "success");
    } catch (err) {
      showToast("Failed to copy link.", "error");
    }
  };

  const formattedDate = new Date(url.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <motion.div
      layout
      exit={{ opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.2 } }}
      className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 flex-grow min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Short Code Badge (Click to copy) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#7C3AED]/10 text-[#7C3AED] hover:bg-[#7C3AED]/15 rounded-xl text-sm font-semibold transition-colors border border-[#7C3AED]/20 group"
              title="Click to copy full shortened link"
            >
              <span>/{url.shortCode}</span>
              <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </motion.button>

            {/* Protection Badge */}
            {url.isProtected ? (
              <span className="flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-xl text-xs font-semibold">
                <Lock className="w-3 h-3" />
                Protected
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-semibold">
                <Globe className="w-3 h-3" />
                Public
              </span>
            )}
          </div>

          {/* Original URL */}
          <div className="flex items-center gap-1.5 text-gray-500 text-sm">
            <span className="truncate max-w-[280px] sm:max-w-md md:max-w-lg lg:max-w-xl font-medium" title={url.originalUrl}>
              {url.originalUrl}
            </span>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#7C3AED] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Stats and Action Controls */}
        <div className="flex items-center gap-4 sm:self-center justify-between sm:justify-end flex-shrink-0">
          {/* Clicks & Date stats */}
          <div className="flex items-center gap-4 text-gray-500 text-sm">
            <div className="flex items-center gap-1.5" title={`${url.clicks} clicks`}>
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-700">{url.clicks}</span>
              <span className="text-xs text-gray-400">clicks</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formattedDate}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(url)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-gray-100 rounded-xl transition-colors"
              title="Edit URL parameters"
            >
              <Edit className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              disabled={isDeleting}
              onClick={() => onDelete(url._id)}
              className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50/50 border border-red-100/50 rounded-xl transition-colors disabled:opacity-50"
              title="Delete URL"
            >
              <Trash className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
