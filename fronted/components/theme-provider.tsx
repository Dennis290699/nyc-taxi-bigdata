"use client"

import * as React from "react"
import { useThemeStore } from "@/store/theme-store"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useThemeStore()

  React.useEffect(() => {
    // Initialize theme on mount
    setTheme(theme)
  }, [theme, setTheme])

  return <>{children}</>
}
