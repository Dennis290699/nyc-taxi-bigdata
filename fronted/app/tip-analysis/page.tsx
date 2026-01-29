"use client"

import { Suspense, useState, useMemo } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { TipChart } from "@/components/charts/tip-chart"
import { StatCard } from "@/components/stats/stat-card"
import { DollarSign, Percent, TrendingUp } from "lucide-react"
import { api } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TipAnalysis } from "@/lib/types"
import { ALLOWED_YEARS } from "@/lib/utils"
import { ErrorState } from "@/components/ui/error-state"


function TipAnalysisContent() {
  const { data, error, isLoading } = useSWR("/tip-analysis", api.getTipAnalysis)
  const [selectedYear, setSelectedYear] = useState<string>("all")

  // Extract available years
  const availableYears = useMemo(() => {
    if (!data) return []
    const years = new Set(data.map((item) => item.year).filter(Boolean))
    // Filter by ALLOWED_YEARS
    const allowed = Array.from(years).filter(y => ALLOWED_YEARS.includes(y))
    return allowed.sort().reverse().map(String)
  }, [data])

  // Filter and Aggregate Data
  const processedData = useMemo(() => {
    if (!data) return []

    // 1. Filter by Year
    let filtered = data.filter((item) => ALLOWED_YEARS.includes(item.year))
    if (selectedYear !== "all") {
      filtered = filtered.filter((item) => item.year.toString() === selectedYear)
    }

    // 2. Aggregate (Weighted Averages)
    const aggregationMap = new Map<string, { totalTip: number; totalFare: number; count: number; bucket: string }>()

    filtered.forEach((item) => {
      const existing = aggregationMap.get(item.distance_bucket)
      if (!existing) {
        aggregationMap.set(item.distance_bucket, {
          totalTip: item.avg_tip * item.trip_count,
          totalFare: item.avg_total * item.trip_count,
          count: item.trip_count,
          bucket: item.distance_bucket,
        })
      } else {
        existing.totalTip += item.avg_tip * item.trip_count
        existing.totalFare += item.avg_total * item.trip_count
        existing.count += item.trip_count
      }
    })

    // Convert back to TipAnalysis format
    return Array.from(aggregationMap.values()).map((agg) => {
      const avg_tip = agg.count > 0 ? agg.totalTip / agg.count : 0
      const avg_total = agg.count > 0 ? agg.totalFare / agg.count : 0
      return {
        distance_bucket: agg.bucket,
        avg_tip: avg_tip,
        avg_total: avg_total,
        trip_count: agg.count,
        tip_percentage: avg_total > 0 ? (avg_tip / avg_total) * 100 : 0,
        year: selectedYear === "all" ? 0 : parseInt(selectedYear), // 0 indicates aggregate
      } as TipAnalysis
    })
  }, [data, selectedYear])

  if (error) {
    return (
      <ErrorState
        title="Failed to load tip data"
        description={error.message || "Unable to retrieve tipping analysis. Please check your connection."}
      />
    )
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
        <Skeleton className="h-[450px] w-full" />
      </div>
    )
  }

  const avgTip =
    processedData.reduce((sum, item) => sum + item.avg_tip * item.trip_count, 0) /
    processedData.reduce((sum, item) => sum + item.trip_count, 0)
  const avgTipPercent =
    processedData.reduce((sum, item) => sum + item.tip_percentage * item.trip_count, 0) /
    processedData.reduce((sum, item) => sum + item.trip_count, 0)

  // Find max average tip safely
  const highestTip =
    processedData.length > 0 ? processedData.reduce((max, item) => (item.avg_tip > max.avg_tip ? item : max)) : null

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Tipping Behavior</h2>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {availableYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Average Tip"
          value={`$${avgTip.toFixed(2)}`}
          subtitle={selectedYear === "all" ? "All time weighted avg" : `in ${selectedYear}`}
          icon={DollarSign}
          delay={0.1}
        />
        <StatCard
          title="Average Tip %"
          value={`${avgTipPercent.toFixed(1)}%`}
          subtitle="Of total fare"
          icon={Percent}
          delay={0.2}
        />
        <StatCard
          title="Highest Tip Range"
          value={highestTip ? highestTip.distance_bucket : "N/A"}
          subtitle={highestTip ? `$${highestTip.avg_tip.toFixed(2)} average` : "N/A"}
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Chart */}
      <TipChart data={processedData} />
    </div>
  )
}

export default function TipAnalysisPage() {
  return (
    <div className="space-y-8">
      <Header title="Tip Analysis" description="Understand tipping behavior across different trip distances" />
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }
      >
        <TipAnalysisContent />
      </Suspense>
    </div>
  )
}
