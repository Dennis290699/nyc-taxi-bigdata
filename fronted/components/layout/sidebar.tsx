"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Database,
  Menu,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

import { Separator } from "@/components/ui/separator"

import { navItems, footerItems } from "@/lib/nav-config"
import { useSidebar } from "@/components/providers/sidebar-provider"

export function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggle } = useSidebar()

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-card shadow-lg overflow-hidden"
    >
      <div className="flex h-full flex-col w-full">
        <motion.div
          animate={{
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{
            duration: 5,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="flex h-20 items-center justify-between border-b border-border/50 bg-gradient-to-r from-primary/15 via-primary/5 to-accent/15 px-4 bg-[length:200%_200%]"
        >
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-2 ring-primary/20">
                  <Database className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col whitespace-nowrap">
                  <span className="text-base font-bold text-foreground">NYC Taxi Analytics</span>
                  <span className="text-xs font-medium text-muted-foreground">HDFS + Spark</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className="h-9 w-9 shrink-0 hover:bg-primary/10 ml-auto"
          >
            <Menu className={cn("h-4 w-4 transition-transform", isCollapsed && "rotate-180")} />
          </Button>
        </motion.div>

        <nav className="flex-1 space-y-2 overflow-y-auto p-3">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Analytics
              </motion.p>
            )}
          </AnimatePresence>

          {navItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: isCollapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-1 items-center justify-between"
                      >
                        <span className="text-balance">{item.title}</span>
                        {isActive && <ChevronRight className="h-4 w-4" />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 -z-10 rounded-lg bg-primary"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}

          <Separator className="my-4" />

          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Resources
              </motion.p>
            )}
          </AnimatePresence>

          {footerItems.map((item, index) => {
            const isActive = pathname === item.href
            const Icon = item.icon

            return (
              <Link key={item.href} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navItems.length + index) * 0.05 }}
                  whileHover={{ x: isCollapsed ? 0 : 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground",
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-1 items-center justify-between"
                      >
                        <span className="text-balance">{item.title}</span>
                        {isActive && <ChevronRight className="h-4 w-4" />}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border/50 bg-gradient-to-r from-muted/50 to-transparent p-4">
          <div className="flex items-center justify-center gap-3">
            <ThemeToggle />
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-muted-foreground"
                >
                  Toggle Theme
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.aside >
  )
}
