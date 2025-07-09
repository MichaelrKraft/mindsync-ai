"use client";

import React from "react";
import { MindSyncSidebar } from "./mindsync-sidebar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function MainLayout({ children, className }: MainLayoutProps) {
  return (
    <div className="h-screen bg-mindsync-bg-light overflow-hidden">
      <MindSyncSidebar className="h-full">
        <main className={cn(
          "flex-1 flex flex-col overflow-hidden bg-white",
          className
        )}>
          <div className="flex-1 overflow-auto custom-scrollbar">
            {children}
          </div>
        </main>
      </MindSyncSidebar>
    </div>
  );
}