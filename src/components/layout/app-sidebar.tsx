"use client";

import React, { useState } from "react";
import { 
  IconHome,
  IconSearch,
  IconBulb,
  IconTimeline,
  IconSettings,
  IconUser,
  IconPlus,
  IconBookmark,
  IconNetwork,
  IconFiles
} from "@tabler/icons-react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/aceternity/sidebar";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getUnreadInsights } from "@/data/mock-content";

export function AppSidebar() {
  const [open, setOpen] = useState(false);
  const unreadCount = getUnreadInsights().length;

  const links = [
    {
      label: "Dashboard",
      href: "/",
      icon: (
        <IconHome className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "All Content",
      href: "/content",
      icon: (
        <IconFiles className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Search",
      href: "/search",
      icon: (
        <IconSearch className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Insights",
      href: "/insights",
      icon: (
        <div className="relative">
          <IconBulb className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          {unreadCount > 0 && (
            <Badge 
              variant="ai" 
              className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      ),
    },
    {
      label: "Timeline",
      href: "/timeline",
      icon: (
        <IconTimeline className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Connections",
      href: "/connections",
      icon: (
        <IconNetwork className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const bottomLinks = [
    {
      label: "Settings",
      href: "/settings",
      icon: (
        <IconSettings className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/profile",
      icon: (
        <IconUser className="text-mindsync-gray-light dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className={cn(
      "h-screen flex flex-col bg-white border-r border-gray-200 dark:border-neutral-700",
      "md:w-[300px]"
    )}>
      <Sidebar open={open} setOpen={setOpen} animate={true}>
        <SidebarBody className="justify-between gap-10 bg-white">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            
            {/* Quick Add Button */}
            <div className="mt-8 mb-4">
              <Button 
                className={cn(
                  "w-full justify-start gap-2 bg-mindsync-blue hover:bg-mindsync-blue/90",
                  !open && "w-10 h-10 p-0 justify-center"
                )}
                size={open ? "default" : "icon"}
              >
                <IconPlus className="h-4 w-4 flex-shrink-0" />
                {open && <span>Quick Add</span>}
              </Button>
            </div>

            {/* Main Navigation */}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div>
            <div className="border-t border-gray-200 pt-4 mb-4">
              {bottomLinks.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-mindsync-blue flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">AC</span>
              </div>
              {open && (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-mindsync-gray">Alex Chen</span>
                  <span className="text-xs text-mindsync-gray-light">alex@example.com</span>
                </div>
              )}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}

const Logo = () => {
  return (
    <div className="flex items-center gap-2 py-2">
      <div className="h-8 w-8 rounded-lg bg-mindsync-blue flex items-center justify-center">
        <span className="text-white font-bold text-sm">M</span>
      </div>
      <span className="font-bold text-xl text-mindsync-gray">MindSync</span>
    </div>
  );
};

const LogoIcon = () => {
  return (
    <div className="flex items-center justify-center py-2">
      <div className="h-8 w-8 rounded-lg bg-mindsync-blue flex items-center justify-center">
        <span className="text-white font-bold text-sm">M</span>
      </div>
    </div>
  );
};