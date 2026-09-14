import React from "react";
import { NavLink } from "react-router-dom";
import {
  Users,
  Award,
  Trophy,
  Briefcase,
  History,
  Wrench,
  Boxes,
  BookOpen,
  Library,
  GraduationCap,
  School,
  Image,
  FolderKanban,
  UserCheck,
  Contact,
} from "lucide-react";

const Navbar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { id: "users", label: "Users", icon: Users, path: "/admin/all-users" },

    { id: "add-award", label: "Add Award", icon: Award, path: "/award" },
    { id: "all-award", label: "All Award", icon: Trophy, path: "/admin/all-awards" },

    { id: "add-experience", label: "Add Experience", icon: Briefcase, path: "/experience" },
    { id: "all-experience", label: "All Experience", icon: History, path: "/admin/all-experiences" },

    { id: "add-tools", label: "Add Tools", icon: Wrench, path: "/tools" },
    { id: "all-tools", label: "All Tools", icon: Boxes, path: "/admin/all-tools" },

    { id: "add-research", label: "Add Research", icon: BookOpen, path: "/research" },
    { id: "all-research", label: "All Research", icon: Library, path: "/admin/all-research" },

    { id: "add-courses", label: "Add Courses", icon: GraduationCap, path: "/courses" },
    { id: "all-courses", label: "All Courses", icon: School, path: "/admin/all-courses" },

    { id: "add-academic", label: "Add Academic", icon: GraduationCap, path: "/academic" },
    { id: "all-academics", label: "All Academics", icon: School, path: "/admin/all-academics" },

    { id: "add-gallery", label: "Add Gallery", icon: Image, path: "/gallery" },
    { id: "all-gallery", label: "All Gallery", icon: FolderKanban, path: "/admin/all-gallery" },

    { id: "add-referees", label: "Add Referees", icon: UserCheck, path: "/referees" },
    { id: "all-referees", label: "All Referees", icon: Contact, path: "/admin/all-referees" },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* SIDE NAVIGATION */}
      <aside
        className={`
          fixed z-50 transition-all duration-300 ease-in-out
          top-20 right-4 left-4 flex flex-col p-2.5
          bg-[#163A2D]/95 backdrop-blur-xl border border-emerald-800/60 rounded-2xl shadow-2xl gap-1.5 
          max-h-[75vh] overflow-y-auto scrollbar-none

          lg:left-auto lg:top-1/2 lg:right-5 lg:-translate-y-1/2 lg:w-auto lg:items-end lg:gap-1.5 lg:bg-transparent lg:border-none lg:p-0 lg:shadow-none lg:backdrop-blur-none lg:max-h-[88vh] lg:overflow-y-auto lg:pr-1

          ${
            isOpen
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-95 pointer-events-none lg:opacity-100 lg:scale-100 lg:pointer-events-auto"
          }
        `}
      >
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              end={item.path === "/"}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => `
                group relative flex items-center transition-all duration-300 ease-in-out w-full lg:w-auto

                ${
                  isActive
                    ? `bg-[#0C2219] text-white font-semibold px-3.5 py-2 rounded-xl border border-emerald-500/40 shadow-md justify-start lg:justify-center`
                    : `text-emerald-100 hover:text-white hover:bg-emerald-900/60 p-2 rounded-xl lg:bg-[#163A2D]/90 lg:border lg:border-emerald-800/60 lg:backdrop-blur-md justify-start lg:justify-center`
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 shrink-0 ${
                      isActive ? "text-emerald-400 stroke-[2.5]" : "text-emerald-100 stroke-2"
                    }`}
                  />

                  {/* Responsive Label */}
                  <span
                    className={`ml-3 text-sm whitespace-nowrap tracking-wide font-['Playfair_Display',serif] ${
                      isActive ? "inline-block text-emerald-300 font-bold" : "inline-block lg:hidden text-white"
                    }`}
                  >
                    {item.label}
                  </span>

                  {/* Desktop Hover Tooltip */}
                  {!isActive && (
                    <span className="hidden lg:block absolute right-14 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none bg-[#163A2D] text-white text-xs py-1.5 px-3 rounded-lg border border-emerald-700/60 whitespace-nowrap shadow-xl font-['Playfair_Display',serif]">
                      {item.label}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </aside>
    </>
  );
};

export default Navbar;