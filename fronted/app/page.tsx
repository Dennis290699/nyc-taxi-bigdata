"use client"

import { Suspense } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/stats/stat-card"
import { StorageRadialChart } from "@/components/charts/storage-radial-chart"
import { SystemHealthCard } from "@/components/stats/system-health-card"
import { Database, Calendar, TrendingUp, FileText, Folder, AlertCircle, DollarSign, Activity, CreditCard } from "lucide-react"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/ui/error-state"

function DashboardContent() {
  const {
    data: systemStats,
    error,
    isLoading,
  } = useSWR("/system-stats", api.getSystemStats, {
    refreshInterval: 30000,
  })

  // Removed chart data fetching from Home

  if (error) {
    return (
      <ErrorState
        title="Failed to load system stats"
        description={error.message || "Could not retrieve system health and overview data."}
      />
    )
  }

  if (isLoading || !systemStats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    )
  }

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024)
    return gb >= 1 ? `${gb.toFixed(2)} GB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num)
  }

  const formatCurrency = (num: number) => {
    // Billions
    if (num >= 1000000000) return `$${(num / 1000000000).toFixed(2)}B`;
    // Millions
    if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
    return `$${num.toLocaleString()}`;
  }

  return (
    <div className="space-y-8">
      {/* 1. High Level Business Metrics */}
      <h2 className="text-lg font-semibold tracking-tight">Analytics Overview</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Mandatory Row (Priority 1) */}
        <StatCard
          title="Total Trips Analyzed"
          value={formatNumber(systemStats.dataset_summary.total_trips)}
          subtitle="Processed records"
          icon={TrendingUp}
          delay={0.1}
        />
        <StatCard
          title="Data Lake Volume"
          value={formatBytes(systemStats.data_lake.size_bytes)}
          subtitle="Total HDFS size"
          icon={Database}
          delay={0.2}
        />
        <StatCard
          title="Period Covered"
          value={
            systemStats.dataset_summary.date_end
              ? `${systemStats.dataset_summary.date_end.split("-")[1]}/${systemStats.dataset_summary.date_end.split("-")[2]}`
              : "N/A"
          }
          subtitle={
            systemStats.dataset_summary.date_start ? `From ${systemStats.dataset_summary.date_start}` : "Processing..."
          }
          icon={Calendar}
          delay={0.3}
        />

        {/* Enriched Metrics (Priority 2) */}
        <StatCard
          title="Estimated Revenue"
          value={systemStats.dataset_summary.total_revenue ? formatCurrency(systemStats.dataset_summary.total_revenue) : "Calculating..."}
          subtitle="Gross Volume"
          icon={DollarSign}
          delay={0.4}
        />
        <StatCard
          title="Average Fare"
          value={systemStats.dataset_summary.avg_fare ? `$${systemStats.dataset_summary.avg_fare.toFixed(2)}` : "Calculating..."}
          subtitle="Per Trip"
          icon={Activity}
          delay={0.5}
        />
        <StatCard
          title="Top Payment Method"
          value={systemStats.dataset_summary.top_payment_method || "Processing..."}
          subtitle="Most frequent"
          icon={CreditCard}
          delay={0.6}
        />
      </div>

      {/* 2. Infrastructure & Health Section */}
      <h2 className="text-lg font-semibold tracking-tight">Infrastructure Status</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {/* Cluster Health */}
        <SystemHealthCard
          health={systemStats.infrastructure.health}
          activeDatanodes={systemStats.infrastructure.active_datanodes}
          capacityUsedPercent={systemStats.infrastructure.volume.percent_used}
          missingBlocks={systemStats.infrastructure.blocks.missing}
          corruptBlocks={systemStats.infrastructure.blocks.corrupt}
        />

        {/* Detailed Storage Usage (Custom Styled to match StatCard) */}
        {/* Detailed Storage Usage */}
        <StorageRadialChart
          percentUsed={systemStats.infrastructure.volume.percent_used}
          usedBytes={formatBytes(systemStats.infrastructure.volume.capacity_used_bytes)}
          totalBytes={formatBytes(systemStats.infrastructure.volume.capacity_total_bytes)}
        />

        {/* File System Stats Grid (Internal to this section) */}
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <StatCard
              title="Files"
              value={formatNumber(systemStats.data_lake.total_files)}
              subtitle="In Data Lake"
              icon={FileText}
              delay={0.4}
            />
            <StatCard
              title="Folders"
              value={formatNumber(systemStats.data_lake.total_directories)}
              subtitle="Partitions"
              icon={Folder}
              delay={0.5}
            />
          </div>
          <StatCard
            title="Total Blocks"
            value={formatNumber(systemStats.infrastructure.blocks.total)}
            subtitle="HDFS Blocks"
            icon={AlertCircle}
            delay={0.6}
          />
        </div>

      </div>

      <div className="text-xs text-muted-foreground text-center">
        Last system update: {new Date(systemStats.last_check).toLocaleString()}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Header
        title="Dashboard Overview"
        description="Real-time analytics and system health monitoring for NYC taxi data"
      />
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </div>
  )
}
