"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth/auth-modal";
import { useAuth } from "@/components/auth/auth-provider";
import { 
  LayoutDashboard, 
  BookOpen, 
  Search, 
  Brain, 
  Clock, 
  Network, 
  Settings,
  BookmarkPlus,
  Lightbulb,
  LogOut,
  LogIn
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface MindSyncSidebarProps {
  children: React.ReactNode;
  className?: string;
}

// Custom bookmark link component that works with the sidebar
const BookmarkSidebarLink = ({ className }: { className?: string }) => {
  const { open, animate } = useSidebar();
  
  return (
    <div className={cn("flex items-center justify-start gap-2 group/sidebar py-2", className)}>
      <BookmarkPlus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      <motion.div
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        <BookmarkButton variant="ghost" size="sm" className="p-0 h-auto font-normal">
          Save Bookmark
        </BookmarkButton>
      </motion.div>
    </div>
  );
};

export function MindSyncSidebar({ children, className }: MindSyncSidebarProps) {
  const [open, setOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();
  
  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "All Content",
      href: "/content",
      icon: (
        <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Insights",
      href: "/insights",
      icon: (
        <Brain className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Timeline",
      href: "/timeline",
      icon: (
        <Clock className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Connections",
      href: "/connections",
      icon: (
        <Network className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Search",
      href: "/search",
      icon: (
        <Search className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const bottomLinks = [
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className={cn("flex flex-col md:flex-row bg-white dark:bg-neutral-900 w-full flex-1 overflow-hidden", className)}>
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <MindSyncLogo /> : <MindSyncLogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link}
                  className="hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-2 transition-colors" 
                />
              ))}
              {/* Custom Bookmark Button */}
              <BookmarkSidebarLink className="hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-2 transition-colors" />
            </div>
          </div>
          <div className="space-y-2">
            {user && bottomLinks.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link}
                className="hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-2 transition-colors" 
              />
            ))}
            
            {user ? (
              <>
                <SidebarLink
                  link={{
                    label: user.user_metadata?.name || user.email || "User",
                    href: "/profile",
                    icon: (
                      <Image
                        src={user.user_metadata?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"}
                        className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                        width={28}
                        height={28}
                        alt="User Avatar"
                      />
                    ),
                  }}
                  className="hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-2 transition-colors"
                />
                
                <div className="flex items-center justify-start gap-2 group/sidebar py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-2 transition-colors cursor-pointer" onClick={() => signOut()}>
                  <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                  >
                    Sign Out
                  </motion.span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-start gap-2 group/sidebar py-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg px-2 transition-colors cursor-pointer" onClick={() => setShowAuthModal(true)}>
                <LogIn className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                <motion.span
                  animate={{
                    display: open ? "inline-block" : "none",
                    opacity: open ? 1 : 0,
                  }}
                  className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                >
                  Sign In
                </motion.span>
              </div>
            )}
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden">
        {children}
      </div>
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </div>
  );
}

export const MindSyncLogo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-gradient-to-br from-mindsync-blue to-mindsync-green rounded-lg flex items-center justify-center flex-shrink-0">
        <Lightbulb className="h-4 w-4 text-white" />
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-black dark:text-white whitespace-pre"
      >
        MindSync
      </motion.span>
    </Link>
  );
};

export const MindSyncLogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black dark:text-white py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-gradient-to-br from-mindsync-blue to-mindsync-green rounded-lg flex items-center justify-center flex-shrink-0">
        <Lightbulb className="h-4 w-4 text-white" />
      </div>
    </Link>
  );
};