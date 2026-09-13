import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../pages/Shared/Navbar";
import { Leaf, TreePine, Sparkles, Microscope } from "lucide-react";

// =====================================================
// FLOATING BOTANICAL & NATURE ICONS CONFIGURATION
// =====================================================
const floatingNatureIcons = [
  // Left Side Floating Stack
  { Icon: Leaf, top: "15%", left: "3%", size: 32, color: "#10B981", delay: 0 },
  { Icon: TreePine, top: "45%", left: "2%", size: 36, color: "#059669", delay: 1 },
  { Icon: Microscope, top: "75%", left: "3%", size: 34, color: "#047857", delay: 2 },

  // Right Side Floating Stack
  { Icon: Sparkles, top: "18%", right: "3%", size: 30, color: "#D97706", delay: 1.5 },
  { Icon: Leaf, top: "50%", right: "2%", size: 34, color: "#10B981", delay: 0.8 },
  { Icon: TreePine, top: "80%", right: "4%", size: 32, color: "#047857", delay: 1.8 },
];

export const AdminLayout = () => {
  return (
    <div className="relative min-h-screen bg-[#F8FAFC] text-zinc-800 flex flex-col justify-between selection:bg-emerald-600 selection:text-white font-['Playfair_Display',serif] overflow-hidden">
      
      {/* 1. Subtle Light Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0596690a_1px,transparent_1px),linear-gradient(to_bottom,#0596690a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* 2. Soft Whitedish / Mint & Emerald Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-teal-100/50 rounded-full blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-[160px]" />
      </div>

      {/* 3. Floating Nature & Research Icons */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {floatingNatureIcons.map((item, idx) => {
          const NatureIcon = item.Icon;
          return (
            <motion.div
              key={idx}
              initial={{ y: 0, opacity: 0.3 }}
              animate={{
                y: [-12, 12, -12],
                scale: [1, 1.08, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 6 + (idx % 3),
                repeat: Infinity,
                ease: "easeInOut",
                delay: item.delay,
              }}
              style={{
                position: "absolute",
                top: item.top,
                left: item.left,
                right: item.right,
              }}
              className="hidden lg:flex p-3.5 rounded-2xl bg-white/80 border border-emerald-100 shadow-xl items-center justify-center backdrop-blur-md"
            >
              <NatureIcon
                size={item.size}
                color={item.color}
                style={{ filter: `drop-shadow(0 2px 8px ${item.color}33)` }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Navigation Bar */}
      <Navbar />

      <main className="relative z-10 flex-grow w-11/12 mx-auto pt-20 sm:pt-24 pb-12">
        <Outlet />
      </main>

    </div>
  );
};