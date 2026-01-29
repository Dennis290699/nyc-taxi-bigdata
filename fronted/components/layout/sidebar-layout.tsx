"use client"

import type React from "react"
import { motion } from "framer-motion"
import { useSidebar } from "@/components/providers/sidebar-provider"
import { Sidebar } from "@/components/layout/sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useIsMobile } from "@/hooks/use-mobile"

export function SidebarLayout({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar()
    const isMobile = useIsMobile()

    return (
        <div className="flex min-h-screen">
            {/* Desktop Sidebar - fixed position but width controlled by motion */}
            <div className="hidden md:block z-50">
                <Sidebar />
            </div>

            {/* Main Content Area */}
            <motion.main
                initial={{ marginLeft: 0 }}
                animate={{
                    marginLeft: isMobile ? 0 : (isCollapsed ? 80 : 280)
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-1 overflow-x-hidden min-h-screen bg-background"
            >
                {/* Mobile Header - Visible only on mobile */}
                <div className="md:hidden flex items-center p-4 border-b">
                    <MobileNav />
                    <span className="font-semibold ml-2">Dashboard</span>
                </div>

                {/* Page Content */}
                <div className="container mx-auto px-4 py-6 lg:px-8">
                    {children}
                </div>
            </motion.main>
        </div>
    )
}
