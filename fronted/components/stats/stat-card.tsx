"use client"

import { motion } from "framer-motion"
import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  delay?: number
}

export function StatCard({ title, value, subtitle, icon: Icon, trend, className, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
      className={cn("h-full", className)}
    >
      <Card className="relative overflow-hidden border-border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 dark:hover:border-primary/40 dark:hover:shadow-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <div className="space-y-1">
                <p className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">{value}</p>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
              </div>
              {trend && (
                <div
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium",
                    trend.isPositive ? "text-chart-5" : "text-destructive",
                  )}
                >
                  <span>{trend.isPositive ? "↑" : "↓"}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
            <div className="rounded-lg bg-primary/10 p-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary via-accent to-chart-3" />
      </Card>
    </motion.div>
  )
}
