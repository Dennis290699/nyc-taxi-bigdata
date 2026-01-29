"use client"

import * as React from "react"

interface SidebarContextType {
    isCollapsed: boolean
    toggle: () => void
    setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = React.useState(false)

    const toggle = () => setIsCollapsed((prev) => !prev)
    const setCollapsed = (collapsed: boolean) => setIsCollapsed(collapsed)

    return (
        <SidebarContext.Provider value={{ isCollapsed, toggle, setCollapsed }}>
            {children}
        </SidebarContext.Provider>
    )
}

export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (context === undefined) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
