import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "../components/Navbar";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Shield, Link2, Key, ArrowRight } from "lucide-react";

// Floating card component
const FloatingCard: React.FC<{
  initialX: number;
  initialY: number;
  driftX: number;
  driftY: number;
  duration: number;
  children: React.ReactNode;
}> = ({ initialX, initialY, driftX, driftY, duration, children }) => {
  return (
    <motion.div
      initial={{ x: initialX, y: initialY }}
      animate={{
        x: [initialX, initialX + driftX, initialX],
        y: [initialY, initialY + driftY, initialY],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hidden md:flex flex-col gap-1.5 shadow-2xl pointer-events-none select-none text-xs w-48 text-white/60"
    >
      {children}
    </motion.div>
  );
};

// Scroll Reveal wrapper
const ScrollReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [inputUrl, setInputUrl] = useState("");
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedShort, setSimulatedShort] = useState("");

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    setIsSimulating(true);
    setSimulatedShort("");

    setTimeout(() => {
      setIsSimulating(false);
      const randomCode = Math.random().toString(36).substring(2, 8);
      const targetShort = `securelink.co/${randomCode}`;
      
      // Animate typing character by character
      let currentString = "";
      let i = 0;
      const interval = setInterval(() => {
        if (i < targetShort.length) {
          currentString += targetShort[i];
          setSimulatedShort(currentString);
          i++;
        } else {
          clearInterval(interval);
        }
      }, 50);
    }, 1000);
  };

  return (
    <div className="bg-[#030712] min-h-screen text-white relative overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#7C3AED]/15 rounded-full filter blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-purple-900/10 rounded-full filter blur-[150px] pointer-events-none"></div>

      <Navbar />

      {/* Floating Link Cards in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <FloatingCard initialX={150} initialY={200} driftX={40} driftY={30} duration={12}>
          <div className="flex items-center gap-1.5 text-[#7C3AED] font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>🔒 /pay-invoice</span>
          </div>
          <span className="truncate">original: dropbox.com/invoice...</span>
          <span className="text-[10px] text-white/30">Auth required</span>
        </FloatingCard>

        <FloatingCard initialX={1000} initialY={150} driftX={-50} driftY={40} duration={14}>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Link2 className="w-3.5 h-3.5" />
            <span>🌐 /api-docs</span>
          </div>
          <span className="truncate">original: github.com/readme...</span>
          <span className="text-[10px] text-emerald-400/50">2.4k clicks</span>
        </FloatingCard>

        <FloatingCard initialX={200} initialY={600} driftX={30} driftY={-50} duration={16}>
          <div className="flex items-center gap-1.5 text-purple-400 font-bold">
            <Link2 className="w-3.5 h-3.5" />
            <span>🔒 /pitch-deck</span>
          </div>
          <span className="truncate">original: drive.google.com/ppt...</span>
          <span className="text-[10px] text-purple-400/50">5 visitors verified</span>
        </FloatingCard>

        <FloatingCard initialX={950} initialY={550} driftX={-30} driftY={-30} duration={13}>
          <div className="flex items-center gap-1.5 text-blue-400 font-bold">
            <Link2 className="w-3.5 h-3.5" />
            <span>🌐 /vlog-03</span>
          </div>
          <span className="truncate">original: youtube.com/watch...</span>
          <span className="text-[10px] text-blue-400/50">934 clicks</span>
        </FloatingCard>
      </div>

      {/* Hero Section */}
      <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-20 relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7C3AED]/10 border border-[#7C3AED]/20 rounded-full text-xs font-semibold text-[#7C3AED] mb-6"
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Privacy-Centric URL Management</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl"
        >
          Share links.<br />
          <span className="bg-gradient-to-r from-[#7C3AED] via-purple-400 to-pink-500 bg-clip-text text-transparent">
            Control who clicks.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-gray-400 text-base sm:text-xl max-w-2xl leading-relaxed"
        >
          A URL shortener that blocks unauthorized visitors. Secure your shared resources behind email magic link verification.
        </motion.p>

        {/* Interactive Demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-xl mt-12 bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md shadow-2xl"
        >
          <form onSubmit={handleSimulate} className="flex gap-2 w-full">
            <input
              type="text"
              placeholder="Paste a link to shorten (e.g. https://my-secrets.com)"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="flex-grow bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]/20 transition-all text-white"
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="px-6 py-3 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-sm font-semibold rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
            >
              Shorten
            </motion.button>
          </form>

          {/* Typing simulation */}
          <AnimatePresence mode="wait">
            {(isSimulating || simulatedShort) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Short Code:</span>
                  {isSimulating ? (
                    <div className="flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-[#7C3AED] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  ) : (
                    <span className="font-mono text-[#7C3AED] font-bold tracking-wide">
                      {simulatedShort}
                    </span>
                  )}
                </div>
                {!isSimulating && (
                  <span className="text-xs text-purple-400 font-bold bg-[#7C3AED]/10 px-2 py-0.5 rounded border border-[#7C3AED]/20">
                    Mockup Output
                  </span>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 flex gap-4"
        >
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="px-8 py-3.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-base font-semibold rounded-xl transition-all shadow-lg shadow-[#7C3AED]/25 flex items-center gap-2 group"
          >
            <span>Get started</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/auth")}
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 text-base font-semibold rounded-xl transition-all"
          >
            Sign In
          </motion.button>
        </motion.div>
      </header>

      {/* Feature Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 border-t border-white/5">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Features Built for Complete Control</h2>
            <p className="mt-4 text-gray-400">
              Unlike normal URL redirectors, SecureLink guarantees that your links only go to people you trust.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <ScrollReveal>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col gap-4 text-left"
            >
              <div className="p-3 bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/20 rounded-xl w-fit">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Public Links</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Shorten links that redirect instantly. Fast, lightweight, and automatically tracked with precise click metrics.
              </p>
            </motion.div>
          </ScrollReveal>

          {/* Card 2 */}
          <ScrollReveal>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col gap-4 text-left border-t-[#7C3AED]/40"
            >
              <div className="p-3 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-xl w-fit">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Protected Links</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Define access lists. Block random clicks and keep previews, files, and staging deployments locked behind validation.
              </p>
            </motion.div>
          </ScrollReveal>

          {/* Card 3 */}
          <ScrollReveal>
            <motion.div
              whileHover={{ y: -8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md flex flex-col gap-4 text-left"
            >
              <div className="p-3 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-xl w-fit">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Magic Link Access</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Passwordless authentication for your audience. Visitors input their email, get a magic link, and redirect smoothly.
              </p>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center text-xs text-gray-500 relative z-10 bg-black/30">
        <p>&copy; 2026 SecureLink Inc. All rights reserved.</p>
      </footer>
    </div>
  );
};
