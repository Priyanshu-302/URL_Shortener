import React, { useState, useEffect } from "react";
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
  Loader2
} from "lucide-react";

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

export const BioBuilder: React.FC = () => {
  const { showToast } = useToast();
  const { data: userUrls = [], isLoading: urlsLoading } = useUrls();
  const { data: profile, isLoading: profileLoading } = useBioProfile();
  const updateMutation = useUpdateBioProfile();

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

  // Mock theme definitions
  const mockupThemeStyles = {
    minimal: {
      bg: "bg-white",
      text: "text-gray-900",
      bio: "text-gray-500",
      cardBg: "bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800",
      social: "text-gray-600 hover:text-gray-900"
    },
    midnight: {
      bg: "bg-gradient-to-b from-[#0F172A] to-[#020617]",
      text: "text-white",
      bio: "text-gray-400",
      cardBg: "bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/10 text-white shadow-xl shadow-black/20",
      social: "text-gray-400 hover:text-white"
    },
    sunset: {
      bg: "bg-gradient-to-tr from-[#FDA4AF] via-[#F472B6] to-[#BE185D]",
      text: "text-white",
      bio: "text-pink-100",
      cardBg: "bg-white/80 hover:bg-white/90 text-[#BE185D] border border-white/20 shadow-md font-semibold",
      social: "text-white hover:text-pink-100"
    },
    neon: {
      bg: "bg-black border border-pink-500/20",
      text: "text-[#00FFCC] font-mono",
      bio: "text-[#FF007F] font-mono text-xs",
      cardBg: "bg-transparent border border-pink-500 text-pink-500 hover:bg-pink-500/10 shadow-[0_0_8px_rgba(236,72,153,0.3)] font-mono",
      social: "text-[#00FFCC] hover:text-white"
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
                      <div className="h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-xs font-bold text-gray-800">
                        Minimal Light
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Minimal</span>
                    </div>

                    {/* Theme midnight */}
                    <div
                      onClick={() => setTheme("midnight")}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                        theme === "midnight" ? "border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 bg-gradient-to-b from-[#0F172A] to-[#020617] rounded-lg flex items-center justify-center text-xs font-bold text-white">
                        Midnight Navy
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Midnight</span>
                    </div>

                    {/* Theme sunset */}
                    <div
                      onClick={() => setTheme("sunset")}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                        theme === "sunset" ? "border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 bg-gradient-to-tr from-[#FDA4AF] via-[#F472B6] to-[#BE185D] rounded-lg flex items-center justify-center text-xs font-bold text-white">
                        Sunset Pink
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Sunset</span>
                    </div>

                    {/* Theme neon */}
                    <div
                      onClick={() => setTheme("neon")}
                      className={`p-4 border rounded-2xl cursor-pointer transition-all flex flex-col gap-2 relative ${
                        theme === "neon" ? "border-[#7C3AED] bg-[#7C3AED]/5 ring-1 ring-[#7C3AED]" : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="h-10 bg-black rounded-lg flex items-center justify-center text-xs font-bold text-[#00FFCC] border border-pink-500/30">
                        Cyber Neon
                      </div>
                      <span className="text-xs font-bold text-center text-gray-700">Neon</span>
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
            <div className={`flex-1 rounded-[32px] overflow-y-auto px-4 pt-8 pb-4 relative space-y-5 flex flex-col select-none scrollbar-none ${mockupThemeStyles.bg}`}>
              
              {/* Profile Header */}
              <div className="flex flex-col items-center text-center space-y-2 mt-4">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Preview avatar"
                    className="w-16 h-16 rounded-full object-cover border border-white/20 shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xl border border-white/20 shadow-sm">
                    {(displayName || "U")[0].toUpperCase()}
                  </div>
                )}
                <div className="space-y-0.5">
                  <h4 className={`text-base font-extrabold truncate max-w-[200px] leading-tight ${mockupThemeStyles.text}`}>
                    {displayName || "Your Name"}
                  </h4>
                  <p className={`text-[11px] font-semibold opacity-70 ${mockupThemeStyles.bio}`}>
                    @{username || "username"}
                  </p>
                </div>
                {bio && (
                  <p className={`text-xs max-w-[220px] leading-snug line-clamp-3 ${mockupThemeStyles.bio}`}>
                    {bio}
                  </p>
                )}
              </div>

              {/* Social connect badges */}
              {(instagram || twitter || github || linkedin || youtube) && (
                <div className="flex flex-wrap justify-center gap-3">
                  {instagram && (
                    <span className={`transition-transform duration-200 ${mockupThemeStyles.social}`}>
                      <InstagramIcon />
                    </span>
                  )}
                  {twitter && (
                    <span className={`transition-transform duration-200 ${mockupThemeStyles.social}`}>
                      <TwitterIcon />
                    </span>
                  )}
                  {github && (
                    <span className={`transition-transform duration-200 ${mockupThemeStyles.social}`}>
                      <GithubIcon />
                    </span>
                  )}
                  {linkedin && (
                    <span className={`transition-transform duration-200 ${mockupThemeStyles.social}`}>
                      <LinkedinIcon />
                    </span>
                  )}
                  {youtube && (
                    <span className={`transition-transform duration-200 ${mockupThemeStyles.social}`}>
                      <YoutubeIcon />
                    </span>
                  )}
                </div>
              )}

              {/* Link Buttons Stack */}
              <div className="space-y-3 flex-1">
                {activeUrlItems.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-4">
                    <p className={`text-xs italic opacity-60 ${mockupThemeStyles.bio}`}>
                      No links added yet. Pick links in the editor tab.
                    </p>
                  </div>
                ) : (
                  activeUrlItems.map((url) => (
                    <div
                      key={url._id}
                      className={`w-full py-2.5 px-4 rounded-2xl flex items-center justify-between text-xs transition-transform duration-200 truncate ${mockupThemeStyles.cardBg}`}
                    >
                      <span className="font-semibold truncate pr-2">
                        {url.originalUrl.replace(/https?:\/\/(www\.)?/, "").split("/")[0]}
                      </span>
                      <span className="opacity-60 text-[10px]">/{url.shortCode}</span>
                    </div>
                  ))
                )}
              </div>

              {/* SecureLink Branding Badge */}
              <div className="text-center pt-2 mt-auto">
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
