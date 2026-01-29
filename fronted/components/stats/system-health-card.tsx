"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Server, Database, HardDrive, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface SystemHealthCardProps {
  health: string
  activeDatanodes: number
  capacityUsedPercent: string
  missingBlocks: number
  corruptBlocks: number
}

export function SystemHealthCard({
  health,
  activeDatanodes,
  capacityUsedPercent,
  missingBlocks,
  corruptBlocks,
}: SystemHealthCardProps) {
  const usedPercent = Number.parseFloat(capacityUsedPercent)
  const isHealthy = health === "Normal" && missingBlocks === 0 && corruptBlocks === 0

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Server className="h-4 w-4 text-primary" />
            </div>
            HDFS Cluster Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Health Status */}
          <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/5 p-3">
            <div className="flex items-center gap-2">
              <div className={cn("h-2.5 w-2.5 rounded-full shadow-sm", isHealthy ? "animate-pulse bg-chart-5" : "bg-destructive")} />
              <span className="text-sm font-medium text-foreground">Cluster Status</span>
            </div>
            <span className={cn("rounded-md px-2 py-0.5 text-xs font-bold ring-1 ring-inset", isHealthy ? "bg-chart-5/10 text-chart-5 ring-chart-5/20" : "bg-destructive/10 text-destructive ring-destructive/20")}>
              {health}
            </span>
          </div>

          <div className="space-y-4 px-1">
            {/* Active Datanodes */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Active Datanodes</span>
              </div>
              <span className="text-sm font-bold text-foreground">{activeDatanodes}</span>
            </div>

            {/* Storage Usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">Storage Used</span>
                </div>
                <span className="text-sm font-bold text-foreground">{usedPercent.toFixed(2)}%</span>
              </div>
              <Progress value={usedPercent} className="h-2" />
            </div>
          </div>

          {/* Blocks Status */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1 rounded-lg border border-border/50 bg-secondary/5 p-3 hover:bg-secondary/10 transition-colors">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Missing Blocks</span>
              </div>
              <p className={cn("text-lg font-bold", missingBlocks > 0 ? "text-destructive" : "text-foreground")}>
                {missingBlocks}
              </p>
            </div>
            <div className="space-y-1 rounded-lg border border-border/50 bg-secondary/5 p-3 hover:bg-secondary/10 transition-colors">
              <div className="flex items-center gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Corrupt Blocks</span>
              </div>
              <p className={cn("text-lg font-bold", corruptBlocks > 0 ? "text-destructive" : "text-foreground")}>
                {corruptBlocks}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
