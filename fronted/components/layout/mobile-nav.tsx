"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, Menu, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { navItems, footerItems } from "@/lib/nav-config"
import { cn } from "@/lib/utils"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    }

    const itemVariant = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0 },
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 border-r border-border/50 w-[300px]">
                <SheetHeader className="h-20 flex flex-row items-center justify-start border-b border-border/50 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent px-6 text-left">
                    <SheetTitle className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-2 ring-primary/20">
                            <Database className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-bold text-foreground">NYC Taxi</span>
                            <span className="text-xs font-medium text-muted-foreground">Analytics Dashboard</span>
                        </div>
                    </SheetTitle>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-5rem)]">
                    <div className="flex flex-col gap-6 p-6 pb-24">
                        <motion.div
                            variants={container}
                            initial="hidden"
                            animate={open ? "show" : "hidden"}
                            className="flex flex-col gap-1"
                        >
                            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Analytics
                            </h4>
                            {navItems.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = item.icon
                                return (
                                    <motion.div key={item.href} variants={itemVariant}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none",
                                                isActive
                                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                {item.title}
                                            </div>
                                            {isActive && <ChevronRight className="h-4 w-4 text-primary/50" />}
                                        </Link>
                                    </motion.div>
                                )
                            })}

                            <Separator className="my-4 opacity-50" />

                            <h4 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                                Resources
                            </h4>
                            {footerItems.map((item) => {
                                const isActive = pathname === item.href
                                const Icon = item.icon
                                return (
                                    <motion.div key={item.href} variants={itemVariant}>
                                        <Link
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className={cn(
                                                "group flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 outline-none",
                                                isActive
                                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                                                {item.title}
                                            </div>
                                        </Link>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </div>
                </ScrollArea>
                <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex items-center justify-between rounded-lg border border-border/50 bg-card p-3 shadow-sm">
                        <span className="text-sm font-medium">Theme Mode</span>
                        <ThemeToggle />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
