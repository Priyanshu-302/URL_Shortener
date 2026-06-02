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
      outerBg: "bg-[#F8FAFC]",
      cardWrap: "max-w-md mx-auto bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm my-10 sm:my-20",
      text: "text-gray-900",
      bio: "text-gray-500",
      buttonBg: "bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800",
      social: "text-gray-400 hover:text-gray-700 bg-gray-100/50 hover:bg-gray-100 p-2.5 rounded-full"
    },
    midnight: {
      outerBg: "bg-[#020617] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0B1528] via-[#020617] to-[#020617]",
      cardWrap: "max-w-md mx-auto bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-3xl p-6 sm:p-8 shadow-2xl my-10 sm:my-20",
      text: "text-white",
      bio: "text-slate-400",
      buttonBg: "bg-white/5 hover:bg-white/10 border border-white/10 text-white shadow-lg",
      social: "text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-full"
    },
    sunset: {
      outerBg: "bg-gradient-to-tr from-[#FDA4AF] via-[#F472B6] to-[#BE185D]",
      cardWrap: "max-w-md mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-10 sm:my-20",
      text: "text-white",
      bio: "text-pink-100",
      buttonBg: "bg-white hover:bg-pink-50 text-[#BE185D] font-bold shadow-md shadow-pink-900/10",
      social: "text-white hover:text-pink-100 bg-white/10 hover:bg-white/20 p-2.5 rounded-full"
    },
    neon: {
      outerBg: "bg-black",
      cardWrap: "max-w-md mx-auto bg-black border border-pink-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_20px_rgba(236,72,153,0.15)] my-10 sm:my-20",
      text: "text-[#00FFCC] font-mono",
      bio: "text-[#FF007F] font-mono text-sm",
      buttonBg: "bg-transparent border border-pink-500 text-pink-500 hover:bg-pink-500/10 shadow-[0_0_10px_rgba(236,72,153,0.2)] font-mono",
      social: "text-[#00FFCC] hover:text-white bg-transparent border border-[#00FFCC]/20 hover:border-[#00FFCC] p-2.5 rounded-full"
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
    hidden: { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col justify-between px-4 transition-all duration-300 ${themes.outerBg}`}>
      
      {/* Bio Body Container */}
      <div className={`w-full ${themes.cardWrap}`}>
        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-20 h-20 rounded-full object-cover border border-white/20 shadow-md"
              onError={(e) => {
                (e.target as HTMLElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-2xl border border-white/20 shadow-md">
              {(profile.displayName || "U")[0].toUpperCase()}
            </div>
          )}
          
          <div className="space-y-0.5">
            <h1 className={`text-xl sm:text-2xl font-black tracking-tight ${themes.text}`}>
              {profile.displayName}
            </h1>
            <p className={`text-xs sm:text-sm font-semibold opacity-70 ${themes.bio}`}>
              @{profile.username}
            </p>
          </div>

          {profile.bio && (
            <p className={`text-sm leading-relaxed max-w-xs mt-1 ${themes.bio}`}>
              {profile.bio}
            </p>
          )}
        </div>

        {/* Social Badges Row */}
        {(profile.socials.instagram || profile.socials.twitter || profile.socials.github || profile.socials.linkedin || profile.socials.youtube) && (
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            {profile.socials.instagram && (
              <a 
                href={`https://instagram.com/${profile.socials.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <InstagramIcon />
              </a>
            )}
            {profile.socials.twitter && (
              <a 
                href={`https://twitter.com/${profile.socials.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <TwitterIcon />
              </a>
            )}
            {profile.socials.github && (
              <a 
                href={`https://github.com/${profile.socials.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <GithubIcon />
              </a>
            )}
            {profile.socials.linkedin && (
              <a 
                href={`https://linkedin.com/in/${profile.socials.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <LinkedinIcon />
              </a>
            )}
            {profile.socials.youtube && (
              <a 
                href={`https://youtube.com/@${profile.socials.youtube}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`transition-all duration-200 ${themes.social}`}
              >
                <YoutubeIcon />
              </a>
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
                  <a
                    href={fullShortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full py-3.5 px-5 rounded-2xl flex items-center justify-between text-sm transition-all duration-300 group hover:scale-[1.02] ${themes.buttonBg}`}
                  >
                    <div className="flex items-center gap-2 truncate pr-4">
                      {link.isPasswordProtected && (
                        <Lock className="w-4 h-4 opacity-70 flex-shrink-0" />
                      )}
                      <span className="font-semibold truncate">
                        {link.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <span className="text-xs">/{link.shortCode}</span>
                      <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
                    </div>
                  </a>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>

      {/* Brand Footer */}
      <footer className="text-center py-6 mt-auto">
        <Link 
          to="/"
          className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-45 hover:opacity-75 transition-opacity ${themes.text}`}
        >
          <Shield className="w-3.5 h-3.5 text-[#7C3AED]" />
          <span>SecureLink Portal</span>
          <ArrowRight className="w-3 h-3 text-[#7C3AED]" />
        </Link>
      </footer>
      
    </div>
  );
};
