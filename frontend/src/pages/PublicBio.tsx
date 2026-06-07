import React from "react";
import { useParams, Link } from "react-router-dom";
import { usePublicBioProfile } from "../hooks/useBio";
import { motion } from "framer-motion";
import { 
  ExternalLink,
  Shield, 
  AlertTriangle,
  Loader2,
  Lock,
  ArrowRight
} from "lucide-react";

// Inline brand SVGs for social media icons (lucide-react v1.17 does not export brand icons)
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const YoutubeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

export const PublicBio: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { data: profile, isLoading, isError } = usePublicBioProfile(username || "");

  if (isLoading) {
    return (
      <div className="bg-[#030712] min-h-screen text-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-10 h-10 text-[#7C3AED] animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Fetching secure profile...</p>
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="bg-[#030712] min-h-screen text-white flex flex-col items-center justify-center px-4">
        <div className="bg-gray-900 border border-white/5 p-8 rounded-3xl text-center max-w-md w-full space-y-5 shadow-2xl">
          <div className="p-4 bg-red-500/10 text-red-500 rounded-full w-fit mx-auto border border-red-500/20">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Profile Not Found</h3>
            <p className="text-sm text-gray-400 mt-2 leading-relaxed">
              The bio landing page link you followed is invalid, or the user has deactivated their account.
            </p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-bold rounded-xl transition-colors w-full justify-center"
          >
            Go back to SecureLink
          </Link>
        </div>
      </div>
    );
  }

  // Theme definition mapping
  const themes = {
    minimal: {
      outerBg: "bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-100 relative overflow-hidden",
      cardWrap: "max-w-md mx-auto bg-white/85 backdrop-blur-md border border-sky-100 rounded-[32px] p-6 sm:p-8 shadow-[0_20px_50px_rgba(8,112,184,0.06)] my-10 sm:my-20 relative z-10",
      text: "text-slate-800",
      bio: "text-slate-500",
      buttonBg: "bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-500 hover:to-emerald-500 text-white font-bold shadow-md shadow-sky-400/20",
      social: "text-sky-500 hover:text-emerald-500 bg-sky-50 hover:bg-sky-100 p-2.5 rounded-full border border-sky-100 transition-colors"
    },
    midnight: {
      outerBg: "bg-[#030712] relative overflow-hidden",
      cardWrap: "max-w-md mx-auto bg-slate-950/45 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 sm:p-8 shadow-[0_24px_64px_rgba(0,0,0,0.6)] my-10 sm:my-20 relative z-10",
      text: "text-white",
      bio: "text-slate-400",
      buttonBg: "bg-white/10 hover:bg-[#7C3AED]/20 border border-white/10 hover:border-[#7C3AED]/50 text-white shadow-lg shadow-black/20 hover:shadow-[#7C3AED]/20",
      social: "text-slate-300 hover:text-white bg-white/5 hover:bg-[#7C3AED]/20 p-2.5 rounded-full border border-white/10 transition-colors"
    },
    sunset: {
      outerBg: "bg-gradient-to-tr from-[#FF512F] via-[#F09819] to-[#DD2476] animate-gradient-shift relative overflow-hidden",
      cardWrap: "max-w-md mx-auto bg-white/15 backdrop-blur-lg border border-white/20 rounded-[32px] p-6 sm:p-8 shadow-[0_24px_50px_rgba(0,0,0,0.25)] my-10 sm:my-20 relative z-10",
      text: "text-white",
      bio: "text-pink-100",
      buttonBg: "bg-white hover:bg-pink-50 text-[#DD2476] font-extrabold shadow-xl shadow-pink-900/10",
      social: "text-white hover:text-pink-100 bg-white/10 hover:bg-white/25 p-2.5 rounded-full border border-white/20 transition-colors"
    },
    neon: {
      outerBg: "bg-black cyber-grid relative overflow-hidden",
      cardWrap: "max-w-md mx-auto bg-black/80 border-2 border-pink-500/80 rounded-[32px] p-6 sm:p-8 shadow-[0_0_35px_rgba(236,72,153,0.35),inset_0_0_15px_rgba(236,72,153,0.15)] my-10 sm:my-20 relative z-10",
      text: "text-[#00FFCC] font-mono neon-text-glow",
      bio: "text-[#FF007F] font-mono text-sm tracking-wide",
      buttonBg: "bg-transparent border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black shadow-[0_0_12px_rgba(0,255,204,0.3)] hover:shadow-[0_0_22px_rgba(0,255,204,0.6)] font-mono font-bold",
      social: "text-[#00FFCC] hover:text-[#FF007F] bg-transparent border border-[#00FFCC]/40 hover:border-[#FF007F] p-2.5 rounded-full transition-colors"
    }
  }[profile.theme];

  // Animation variants
  const listVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between px-4 transition-all duration-300 ${themes.outerBg}`}>
      
      {/* Decorative Floating Circles for themes */}
      {profile.theme === "midnight" && (
        <>
          <div className="w-72 h-72 rounded-full bg-purple-600/35 filter blur-3xl absolute top-10 left-10 animate-blob-1 pointer-events-none"></div>
          <div className="w-80 h-80 rounded-full bg-blue-600/25 filter blur-3xl absolute bottom-20 right-10 animate-blob-2 pointer-events-none"></div>
        </>
      )}

      {profile.theme === "minimal" && (
        <>
          <div className="w-96 h-96 rounded-full bg-sky-200/40 filter blur-3xl absolute top-[-5%] left-[-10%] pointer-events-none"></div>
          <div className="w-96 h-96 rounded-full bg-emerald-200/30 filter blur-3xl absolute bottom-[5%] right-[-10%] pointer-events-none"></div>
        </>
      )}

      {/* Bio Body Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`w-full ${themes.cardWrap}`}
      >
        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            {/* Pulsing Avatar Ring */}
            {profile.theme === "midnight" && (
              <div className="absolute inset-0 rounded-full bg-purple-600/50 filter blur-sm scale-110 animate-ring-pulse pointer-events-none"></div>
            )}
            {profile.theme === "neon" && (
              <div className="absolute inset-0 rounded-full border-2 border-pink-500 scale-105 animate-pulse pointer-events-none"></div>
            )}
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-24 h-24 rounded-full object-cover border-2 border-white/20 shadow-lg relative z-10"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A78BFA] text-white flex items-center justify-center font-bold text-3xl border-2 border-white/20 shadow-lg relative z-10">
                {(profile.displayName || "U")[0].toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="space-y-1">
            <h1 className={`text-2xl sm:text-3xl font-black tracking-tight ${themes.text}`}>
              {profile.displayName}
            </h1>
            <p className={`text-xs sm:text-sm font-bold opacity-75 ${themes.bio}`}>
              @{profile.username}
            </p>
          </div>

          {profile.bio && (
            <p className={`text-sm sm:text-base leading-relaxed max-w-sm font-medium ${themes.bio}`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Social Badges Row */}
        {(profile.socials.instagram || profile.socials.twitter || profile.socials.github || profile.socials.linkedin || profile.socials.youtube) && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {profile.socials.instagram && (
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={`https://instagram.com/${profile.socials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <InstagramIcon />
              </motion.a>
            )}
            {profile.socials.twitter && (
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={`https://twitter.com/${profile.socials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <TwitterIcon />
              </motion.a>
            )}
            {profile.socials.github && (
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={`https://github.com/${profile.socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <GithubIcon />
              </motion.a>
            )}
            {profile.socials.linkedin && (
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={`https://linkedin.com/in/${profile.socials.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <LinkedinIcon />
              </motion.a>
            )}
            {profile.socials.youtube && (
              <motion.a 
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                href={`https://youtube.com/@${profile.socials.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <YoutubeIcon />
              </motion.a>
            )}
          </div>
        )}

        {/* Links Stack list */}
        <motion.div
          variants={listVariants}
          initial="hidden"
          animate="show"
          className="space-y-4 mt-8"
        >
          {profile.links.length === 0 ? (
            <div className={`text-center py-10 text-xs italic ${themes.bio}`}>
              No links uploaded yet. Check back later!
            </div>
          ) : (
            profile.links.map((link) => {
              const fullShortUrl = `/${link.shortCode}`;
              return (
                <motion.div key={link._id} variants={itemVariants}>
                  <motion.a
                    whileHover={{ scale: 1.025, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    href={fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-4 px-6 rounded-2xl flex items-center justify-between text-sm sm:text-base transition-all duration-300 group ${themes.buttonBg}`}
                  >
                    <div className="flex items-center gap-2 truncate pr-4">
                      {link.isPasswordProtected && (
                        <Lock className="w-4 h-4 opacity-75 flex-shrink-0" />
                      )}
                      <span className="font-bold truncate">
                        {link.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-75 group-hover:opacity-100 transition-all flex-shrink-0">
                      <span className="text-xs font-semibold">/{link.shortCode}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </motion.a>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </motion.div>

      {/* Brand Footer */}
      <footer className="text-center py-8 mt-auto relative z-10">
        <Link 
          to="/"
          className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider opacity-50 hover:opacity-85 transition-opacity ${themes.text}`}
        >
          <Shield className="w-4 h-4 text-[#7C3AED]" />
          <span>SecureLink Portal</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#7C3AED]" />
        </Link>
      </footer>
      
    </div>
  );
};
