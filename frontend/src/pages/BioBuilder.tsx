import React, { useState, useEffect, useRef } from "react";
import { Navbar } from "../components/Navbar";
import { useUrls } from "../hooks/useUrls";
import { useBioProfile, useUpdateBioProfile } from "../hooks/useBio";
import { useToast } from "../components/Toast";
import { 
  Save, 
  ExternalLink,
  User, 
  Link as LinkIcon, 
  Palette, 
  Sparkles,
  Loader2,
  Lock
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// Inline brand SVGs for social media icons (lucide-react v1.17 does not export brand icons)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

// High-fidelity interactive card for the mobile preview (scaled down for phone screen container)
interface MockupInteractiveCardProps {
  children: React.ReactNode;
  theme: "minimal" | "midnight" | "sunset" | "neon";
  className: string;
}

const MockupInteractiveCard: React.FC<MockupInteractiveCardProps> = ({ children, theme, className }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Motion values for magnetic pull (max 5px displacement)
  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  
  // Motion values for 3D tilt (max 6 degrees)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  
  // Motion values for internal text/elements parallax depth
  const contentX = useMotionValue(0);
  const contentY = useMotionValue(0);
  
  // Motion values for spotlight tracking relative to card bounding box
  const spotlightX = useMotionValue(0);
  const spotlightY = useMotionValue(0);
  const spotlightOpacity = useMotionValue(0);
  
  // Spring configurations
  const springConfig = { damping: 25, stiffness: 150, mass: 0.6 };
  
  const springCardX = useSpring(cardX, springConfig);
  const springCardY = useSpring(cardY, springConfig);
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);
  const springContentX = useSpring(contentX, springConfig);
  const springContentY = useSpring(contentY, springConfig);
  const springSpotlightX = useSpring(spotlightX, { damping: 30, stiffness: 120 });
  const springSpotlightY = useSpring(spotlightY, { damping: 30, stiffness: 120 });
  const springSpotlightOpacity = useSpring(spotlightOpacity, { damping: 20, stiffness: 150 });

  const getSpotlightColor = () => {
    switch (theme) {
      case "midnight": return "rgba(139, 92, 246, 0.35)"; // Purple
      case "sunset": return "rgba(255, 255, 255, 0.4)"; // White
      case "neon": return "rgba(0, 255, 204, 0.35)"; // Cyan
      case "minimal":
      default:
        return "rgba(14, 165, 233, 0.3)"; // Sky Blue
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const pullX = (x - centerX) * 0.08;
    const pullY = (y - centerY) * 0.08;
    
    const tiltX = -(y - centerY) / (rect.height / 12);
    const tiltY = (x - centerX) / (rect.width / 12);
    
    const paraX = -(x - centerX) * 0.03;
    const paraY = -(y - centerY) * 0.03;

    cardX.set(pullX);
    cardY.set(pullY);
    rotateX.set(tiltX);
    rotateY.set(tiltY);
    contentX.set(paraX);
    contentY.set(paraY);
    
    spotlightX.set(x);
    spotlightY.set(y);
    spotlightOpacity.set(1);
  };

  const handleMouseLeave = () => {
    cardX.set(0);
    cardY.set(0);
    rotateX.set(0);
    rotateY.set(0);
    contentX.set(0);
    contentY.set(0);
    spotlightOpacity.set(0);
  };

  const scale = useTransform(springSpotlightOpacity, [0, 1], [1, 1.025]);
  const cleanedClassName = className.replace(/transition-all|duration-\d+/g, "");

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        x: springCardX,
        y: springCardY,
        rotateX: springRotateX,
        rotateY: springRotateY,
        scale,
        transformStyle: "preserve-3d" as const,
      }}
      className={`${cleanedClassName} overflow-hidden relative cursor-default block`}
    >
      <motion.div
        style={{
          x: springSpotlightX,
          y: springSpotlightY,
          opacity: springSpotlightOpacity,
          translateX: "-50%",
          translateY: "-50%",
          background: `radial-gradient(circle 80px, ${getSpotlightColor()}, transparent 100%)`
        }}
        className="absolute pointer-events-none w-[160px] h-[160px] z-0 top-0 left-0"
      />
      
      <motion.div
        style={{
          x: springContentX,
          y: springContentY,
          transformStyle: "preserve-3d" as const,
        }}
        className="w-full flex items-center justify-between relative z-10 pointer-events-none"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Scaled magnetic social badges for phone preview frame
interface MockupMagneticSocialProps {
  children: React.ReactNode;
  className: string;
}

const MockupMagneticSocial: React.FC<MockupMagneticSocialProps> = ({ children, className }) => {
  const ref = useRef<HTMLSpanElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 220, damping: 20 });
  const springY = useSpring(y, { stiffness: 220, damping: 20 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLSpanElement>) => {
    const span = ref.current;
    if (!span) return;
    
    const rect = span.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const pullX = (e.clientX - centerX) * 0.3;
    const pullY = (e.clientY - centerY) * 0.3;
    
    x.set(pullX);
    y.set(pullY);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const cleanedClassName = className.replace(/transition-all|duration-\d+/g, "");
  
  return (
    <motion.span
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.92 }}
      className={`${cleanedClassName} inline-block`}
    >
      {children}
    </motion.span>
  );
};

export const BioBuilder: React.FC = () => {
  const { showToast } = useToast();
  const { data: userUrls = [], isLoading: urlsLoading } = useUrls();
  const { data: profile, isLoading: profileLoading } = useBioProfile();
  const updateMutation = useUpdateBioProfile();

  // Mouse position springs for mockup background blobs
  const pageMouseX = useMotionValue(0);
  const pageMouseY = useMotionValue(0);

  const springPageX = useSpring(pageMouseX, { damping: 60, stiffness: 80 });
  const springPageY = useSpring(pageMouseY, { damping: 60, stiffness: 80 });

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      // Displaces blobs from -30 to 30px depending on cursor coordinates
      const xVal = ((e.clientX / window.innerWidth) - 0.5) * 60;
      const yVal = ((e.clientY / window.innerHeight) - 0.5) * 60;
      pageMouseX.set(xVal);
      pageMouseY.set(yVal);
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    return () => window.removeEventListener("mousemove", handleGlobalMouseMove);
  }, [pageMouseX, pageMouseY]);

  const blob1X = useTransform(springPageX, (x) => x * 0.5);
  const blob1Y = useTransform(springPageY, (y) => y * 0.5);

  const blob2X = useTransform(springPageX, (x) => x * -0.7);
  const blob2Y = useTransform(springPageY, (y) => y * -0.7);

  // Settings State
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [theme, setTheme] = useState<"minimal" | "midnight" | "sunset" | "neon">("minimal");
  const [selectedLinkIds, setSelectedLinkIds] = useState<string[]>([]);
  
  // Socials State
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [youtube, setYoutube] = useState("");

  const [activeTab, setActiveTab] = useState<"profile" | "links" | "socials" | "theme">("profile");

  // Load profile values when loaded
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setDisplayName(profile.displayName || "");
      setBio(profile.bio || "");
      setAvatarUrl(profile.avatarUrl || "");
      setTheme(profile.theme || "minimal");
      
      const linkIds = (profile.links || []).map((l: any) => typeof l === "object" ? l._id : l);
      setSelectedLinkIds(linkIds);

      if (profile.socials) {
        setInstagram(profile.socials.instagram || "");
        setTwitter(profile.socials.twitter || "");
        setGithub(profile.socials.github || "");
        setLinkedin(profile.socials.linkedin || "");
        setYoutube(profile.socials.youtube || "");
      }
    }
  }, [profile]);

  // Checkbox handlers
  const handleToggleLink = (id: string) => {
    setSelectedLinkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSave = async () => {
    if (!username.trim()) {
      showToast("Username handle is required.", "error");
      return;
    }
    
    try {
      await updateMutation.mutateAsync({
        username: username.trim().toLowerCase(),
        displayName: displayName.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
        theme,
        links: selectedLinkIds,
        socials: {
          instagram: instagram.trim(),
          twitter: twitter.trim(),
          github: github.trim(),
          linkedin: linkedin.trim(),
          youtube: youtube.trim()
        }
      });
      showToast("Bio profile saved successfully!", "success");
    } catch (err: any) {
      showToast(err.response?.data?.message || err.message || "Failed to update profile", "error");
    }
  };

  if (profileLoading || urlsLoading) {
    return (
      <div className="bg-[#F8FAFC] min-h-screen text-gray-900 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
          <p className="text-sm text-gray-500 font-semibold">Loading your bio studio...</p>
        </div>
      </div>
    );
  }

  // Find matching URL items
  const activeUrlItems = selectedLinkIds
    .map((id) => userUrls.find((u) => u._id === id))
    .filter((u): u is typeof userUrls[0] => !!u);

  // Mock theme definitions matching PublicBio.tsx exactly
  const mockupThemeStyles = {
    minimal: {
      bg: "bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-100 relative overflow-hidden",
      text: "text-slate-800 font-black",
      bio: "text-slate-500 font-medium",
      cardBg: "bg-gradient-to-r from-sky-400 to-emerald-400 text-white font-bold border-none shadow-md shadow-sky-400/20",
      social: "text-sky-500 hover:text-emerald-500 bg-sky-50 border border-sky-100 p-1.5 rounded-full"
    },
    midnight: {
      bg: "bg-[#030712] relative overflow-hidden",
      text: "text-white font-black",
      bio: "text-slate-400 font-medium",
      cardBg: "bg-white/10 hover:bg-[#7C3AED]/20 border border-white/10 text-white shadow-lg shadow-black/20",
      social: "text-slate-300 hover:text-white bg-white/5 border border-white/10 p-1.5 rounded-full"
    },
    sunset: {
      bg: "bg-gradient-to-tr from-[#FF512F] via-[#F09819] to-[#DD2476] animate-gradient-shift relative overflow-hidden",
      text: "text-white font-black",
      bio: "text-pink-100 font-medium",
      cardBg: "bg-white text-[#DD2476] font-extrabold shadow-xl shadow-pink-900/10 border-none",
      social: "text-white hover:text-pink-100 bg-white/10 border border-white/20 p-1.5 rounded-full"
    },
    neon: {
      bg: "bg-black cyber-grid relative overflow-hidden border border-pink-500/20",
      text: "text-[#00FFCC] font-mono neon-text-glow font-bold",
      bio: "text-[#FF007F] font-mono text-[10px] font-medium tracking-wide",
      cardBg: "bg-transparent border border-cyan-400 text-cyan-400 font-mono shadow-[0_0_8px_rgba(0,255,204,0.3)]",
      social: "text-[#00FFCC] hover:text-[#FF007F] bg-transparent border border-[#00FFCC]/40 p-1.5 rounded-full"
    }
  }[theme];

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-gray-900 flex flex-col">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-grow flex flex-col lg:flex-row gap-8 pb-20">
        
        {/* Left Side: Customizer Inputs */}
        <div className="flex-1 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                Bio Page Studio
                <Sparkles className="w-5 h-5 text-[#7C3AED]" />
              </h1>
              <p className="text-sm text-gray-500 mt-1">Design a unified mobile landing page for your shortened links.</p>
            </div>
            
            <button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#7C3AED]/20 transition-all disabled:opacity-70"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Studio Updates
            </button>
          </div>

          {/* Builder Navigation Tabs */}
          <div className="bg-white border border-gray-100 p-1.5 rounded-2xl shadow-sm flex flex-wrap gap-1 text-sm font-semibold text-gray-500">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === "profile" ? "bg-[#7C3AED]/10 text-[#7C3AED] font-bold" : "hover:text-gray-900"
              }`}
            >
              <User className="w-4 h-4" />
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === "links" ? "bg-[#7C3AED]/10 text-[#7C3AED] font-bold" : "hover:text-gray-900"
              }`}
            >
              <LinkIcon className="w-4 h-4" />
              Include Links ({selectedLinkIds.length})
            </button>
            <button
              onClick={() => setActiveTab("socials")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === "socials" ? "bg-[#7C3AED]/10 text-[#7C3AED] font-bold" : "hover:text-gray-900"
              }`}
            >
              <InstagramIcon className="w-4 h-4" />
              Social Handles
            </button>
            <button
              onClick={() => setActiveTab("theme")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all ${
                activeTab === "theme" ? "bg-[#7C3AED]/10 text-[#7C3AED] font-bold" : "hover:text-gray-900"
              }`}
            >
              <Palette className="w-4 h-4" />
              Design Theme
            </button>
          </div>

          {/* Tab Panels */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm min-h-[380px] flex flex-col justify-between">
            <div>
              {/* Tab 1: Profile Settings */}
              {activeTab === "profile" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Profile Details</h3>
                  
                  {/* Username/Slug */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Unique Bio Slug Handle</label>
                    <div className="relative flex items-center">
                      <span className="absolute left-4 text-gray-400 font-medium text-sm select-none">
                        /bio/
                      </span>
                      <input
                        type="text"
                        placeholder="yourname"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ""))}
                        className="w-full pl-[3.2rem] pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-sm text-gray-900 transition-all font-semibold"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400">Your page URL will be: {window.location.origin}/bio/{username || "handle"}</p>
                  </div>

                  {/* Display Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Display Name</label>
                    <input
                      type="text"
                      placeholder="e.g. John Doe"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-sm text-gray-900 transition-all"
                    />
                  </div>

                  {/* Profile Image URL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Avatar Image URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/photo.jpg"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-sm text-gray-900 transition-all"
                    />
                  </div>

                  {/* Bio Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Bio Description</label>
                    <textarea
                      placeholder="Tell visitors about yourself in a few sentences..."
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-[#7C3AED] outline-none text-sm text-gray-900 transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Tab 2: Included Links */}
              {activeTab === "links" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Select Short Links</h3>
                  <p className="text-xs text-gray-400">Toggle which shortened links from your library appear on your bio page layout.</p>
                  
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {userUrls.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">
                        No short links created yet. Create a link on the dashboard first!
                      </div>
                    ) : (
                      userUrls.map((url) => {
                        const isChecked = selectedLinkIds.includes(url._id);
                        return (
                          <div 
                            key={url._id} 
                            onClick={() => handleToggleLink(url._id)}
                            className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors ${
                              isChecked ? "border-[#7C3AED]/40 bg-[#7C3AED]/5" : "border-gray-100"
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              readOnly
                              className="w-4 h-4 accent-[#7C3AED]"
                            />
                            <div className="flex-grow min-w-0">
                              <span className="text-sm font-bold text-gray-800">/{url.shortCode}</span>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{url.originalUrl}</p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* Tab 3: Socials Settings */}
              {activeTab === "socials" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Social Connects</h3>
                  <p className="text-xs text-gray-400">Fill in your social usernames to display contact badges.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Instagram */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <InstagramIcon className="w-3.5 h-3.5 text-gray-400" />
                        Instagram Handle
                      </label>
                      <input
                        type="text"
                        placeholder="username"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#7C3AED]"
                      />
                    </div>

                    {/* Twitter */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <TwitterIcon className="w-3.5 h-3.5 text-gray-400" />
                        Twitter / X Handle
                      </label>
                      <input
                        type="text"
                        placeholder="username"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#7C3AED]"
                      />
                    </div>

                    {/* Github */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <GithubIcon className="w-3.5 h-3.5 text-gray-400" />
                        GitHub Handle
                      </label>
                      <input
                        type="text"
                        placeholder="username"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#7C3AED]"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <LinkedinIcon className="w-3.5 h-3.5 text-gray-400" />
                        LinkedIn Handle
                      </label>
                      <input
                        type="text"
                        placeholder="username"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#7C3AED]"
                      />
                    </div>

                    {/* YouTube */}
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-600 flex items-center gap-1.5">
                        <YoutubeIcon className="w-3.5 h-3.5 text-gray-400" />
                        YouTube Channel Handle
                      </label>
                      <input
                        type="text"
                        placeholder="channel"
                        value={youtube}
                        onChange={(e) => setYoutube(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-[#7C3AED]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Theme Selector */}
              {activeTab === "theme" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Select Color Theme</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {/* Theme minimal */}
                    <div
                      onClick={() => setTheme("minimal")}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                        theme === "minimal" ? "border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-100 rounded-lg flex items-center justify-center text-xs font-bold text-slate-800 border border-sky-100 shadow-[0_4px_12px_rgba(8,112,184,0.05)]">
                        Ocean Breeze
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Ocean (Light)</span>
                    </div>

                    {/* Theme midnight */}
                    <div
                      onClick={() => setTheme("midnight")}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                        theme === "midnight" ? "border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 bg-[#030712] border border-white/10 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-black/40">
                        Midnight Navy
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Midnight (Dark)</span>
                    </div>

                    {/* Theme sunset */}
                    <div
                      onClick={() => setTheme("sunset")}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                        theme === "sunset" ? "border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 bg-gradient-to-tr from-[#FF512F] via-[#F09819] to-[#DD2476] rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        Sunset Pink
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Sunset (Vibrant)</span>
                    </div>

                    {/* Theme neon */}
                    <div
                      onClick={() => setTheme("neon")}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                        theme === "neon" ? "border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 bg-black rounded-lg flex items-center justify-center text-xs font-bold text-[#00FFCC] border-2 border-pink-500/50 shadow-[0_0_10px_rgba(236,72,153,0.2)] font-mono">
                        Cyber Neon
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Neon (Cyber)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* View page link when profile created */}
            {profile?.username && (
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between text-xs mt-6">
                <span className="text-gray-400 font-semibold">Your Live Profile Link:</span>
                <a
                  href={`/bio/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#7C3AED] hover:underline font-bold flex items-center gap-1"
                >
                  {window.location.origin}/bio/{profile.username}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Live Mobile Mockup Preview */}
        <div className="w-full lg:w-[360px] flex justify-center shrink-0">
          <div className="sticky top-28 bg-gray-900 p-3 rounded-[40px] shadow-2xl border-4 border-gray-800 w-[290px] h-[580px] flex flex-col relative">
            {/* Phone Speaker/Camera slot */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-gray-900 rounded-b-xl z-20"></div>

            {/* Inner Phone Screen */}
            <div className={`flex-1 rounded-[32px] overflow-y-auto px-4 pt-8 pb-4 relative space-y-5 flex flex-col select-none scrollbar-none transition-all duration-300 ${mockupThemeStyles.bg}`}>
              
              {/* Decorative Backgrounds for Mockup Preview */}
              {theme === "midnight" && (
                <>
                  <motion.div style={{ x: blob1X, y: blob1Y }} className="w-40 h-40 rounded-full bg-purple-600/30 filter blur-2xl absolute top-10 left-5 animate-blob-1 pointer-events-none"></motion.div>
                  <motion.div style={{ x: blob2X, y: blob2Y }} className="w-40 h-40 rounded-full bg-blue-600/20 filter blur-2xl absolute bottom-20 right-5 animate-blob-2 pointer-events-none"></motion.div>
                </>
              )}
              {theme === "minimal" && (
                <>
                  <motion.div style={{ x: blob1X, y: blob1Y }} className="w-48 h-48 rounded-full bg-sky-200/30 filter blur-2xl absolute top-[-5%] left-[-10%] pointer-events-none"></motion.div>
                  <motion.div style={{ x: blob2X, y: blob2Y }} className="w-48 h-48 rounded-full bg-emerald-200/20 filter blur-2xl absolute bottom-[5%] right-[-10%] pointer-events-none"></motion.div>
                </>
              )}
              {theme === "sunset" && (
                <>
                  <motion.div style={{ x: blob1X, y: blob1Y }} className="w-48 h-48 rounded-full bg-yellow-400/25 filter blur-2xl absolute top-[-5%] left-[-10%] pointer-events-none"></motion.div>
                  <motion.div style={{ x: blob2X, y: blob2Y }} className="w-48 h-48 rounded-full bg-rose-500/20 filter blur-2xl absolute bottom-[5%] right-[-10%] pointer-events-none"></motion.div>
                </>
              )}
              {theme === "neon" && (
                <>
                  <motion.div style={{ x: blob1X, y: blob1Y }} className="w-40 h-40 rounded-full bg-pink-600/15 filter blur-2xl absolute top-10 left-5 pointer-events-none"></motion.div>
                  <motion.div style={{ x: blob2X, y: blob2Y }} className="w-40 h-40 rounded-full bg-cyan-500/15 filter blur-2xl absolute bottom-20 right-5 pointer-events-none"></motion.div>
                </>
              )}

              {/* Profile Header */}
              <div className="flex flex-col items-center text-center space-y-2 mt-4 relative z-10">
                <div className="relative">
                  {theme === "midnight" && (
                    <div className="absolute inset-0 rounded-full bg-purple-600/50 filter blur-sm scale-110 animate-ring-pulse pointer-events-none"></div>
                  )}
                  {theme === "neon" && (
                    <div className="absolute inset-0 rounded-full border border-pink-500 scale-105 animate-pulse pointer-events-none"></div>
                  )}
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Preview avatar"
                      className="w-16 h-16 rounded-full object-cover border border-white/20 shadow-sm relative z-10"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xl border border-white/20 shadow-sm relative z-10">
                      {(displayName || "U")[0].toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="space-y-0.5">
                  <h4 className={`text-base font-extrabold truncate max-w-[200px] leading-tight ${mockupThemeStyles.text}`}>
                    {displayName || "Your Name"}
                  </h4>
                  <p className={`text-[11px] font-semibold opacity-70 ${mockupThemeStyles.bio}`}>
                    @{username || "username"}
                  </p>
                </div>
                {bio && (
                  <p className={`text-[11px] max-w-[220px] leading-snug line-clamp-3 ${mockupThemeStyles.bio}`}>
                    {bio}
                  </p>
                )}
              </div>

              {/* Social connect badges */}
              {(instagram || twitter || github || linkedin || youtube) && (
                <div className="flex flex-wrap justify-center gap-3 relative z-10">
                  {instagram && (
                    <MockupMagneticSocial className={mockupThemeStyles.social}>
                      <InstagramIcon />
                    </MockupMagneticSocial>
                  )}
                  {twitter && (
                    <MockupMagneticSocial className={mockupThemeStyles.social}>
                      <TwitterIcon />
                    </MockupMagneticSocial>
                  )}
                  {github && (
                    <MockupMagneticSocial className={mockupThemeStyles.social}>
                      <GithubIcon />
                    </MockupMagneticSocial>
                  )}
                  {linkedin && (
                    <MockupMagneticSocial className={mockupThemeStyles.social}>
                      <LinkedinIcon />
                    </MockupMagneticSocial>
                  )}
                  {youtube && (
                    <MockupMagneticSocial className={mockupThemeStyles.social}>
                      <YoutubeIcon />
                    </MockupMagneticSocial>
                  )}
                </div>
              )}

              {/* Link Buttons Stack */}
              <div className="space-y-3 flex-1 relative z-10">
                {activeUrlItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <p className={`text-xs italic opacity-60 ${mockupThemeStyles.bio}`}>
                      No links added yet. Pick links in the editor tab.
                    </p>
                  </div>
                ) : (
                  activeUrlItems.map((url) => (
                    <MockupInteractiveCard
                      key={url._id}
                      theme={theme}
                      className={`w-full py-2.5 px-4 rounded-2xl flex items-center justify-between text-xs truncate ${mockupThemeStyles.cardBg}`}
                    >
                      <div className="flex items-center gap-1.5 truncate relative z-10 pointer-events-none">
                        {url.isProtected && <Lock className="w-3.5 h-3.5 opacity-70 flex-shrink-0" />}
                        <span className="font-bold truncate pr-2">
                          {url.originalUrl.replace(/https?:\/\/(www\.)?/, "").split("/")[0]}
                        </span>
                      </div>
                      <span className="opacity-80 text-[9px] font-bold relative z-10 pointer-events-none">/{url.shortCode}</span>
                    </MockupInteractiveCard>
                  ))
                )}
              </div>

              {/* SecureLink Branding Badge */}
              <div className="text-center pt-2 mt-auto relative z-10">
                <span className={`text-[8px] opacity-40 font-semibold tracking-wider uppercase ${mockupThemeStyles.text}`}>
                  Powered by SecureLink
                </span>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
