"use client"

import { Suspense, useState, useMemo } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { DistanceChart } from "@/components/charts/distance-chart"
import { StatCard } from "@/components/stats/stat-card"
import { TrendingUp, Ruler, Navigation } from "lucide-react"
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
import { DistanceDistribution } from "@/lib/types"
import { ALLOWED_YEARS } from "@/lib/utils"
import { ErrorState } from "@/components/ui/error-state"


function DistanceDistributionContent() {
  const { data, error, isLoading } = useSWR("/distance-distribution", api.getDistanceDistribution)
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

    // 2. Aggregate (Sum count by miles)
    const aggregationMap = new Map<number, DistanceDistribution>()

    filtered.forEach((item) => {
      const existing = aggregationMap.get(item.miles)
      if (existing) {
        existing.count += item.count
      } else {
        aggregationMap.set(item.miles, { ...item })
      }
    })

    // 3. Sort by Distance
    return Array.from(aggregationMap.values()).sort((a, b) => a.miles - b.miles)
  }, [data, selectedYear])

  if (error) {
    return (
      <ErrorState
        title="Failed to load distance data"
        description={error.message || "An unexpected error occurred while fetching trip distance statistics."}
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
        <Skeleton className="h-[500px] w-full" />
      </div>
    )
  }

  const totalTrips = processedData.reduce((sum, item) => sum + item.count, 0)
  const mostCommon = processedData.length > 0 ? processedData.reduce((max, item) => (item.count > max.count ? item : max)) : null
  const avgDistance = processedData.length > 0 ? processedData.reduce((sum, item) => sum + item.miles * item.count, 0) / totalTrips : 0

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Trip Distances</h2>
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
          title="Average Distance"
          value={`${avgDistance.toFixed(1)} mi`}
          subtitle={selectedYear === "all" ? "All time" : `in ${selectedYear}`}
          icon={Ruler}
          delay={0.1}
        />
        <StatCard
          title="Total Trips"
          value={totalTrips.toLocaleString()}
          subtitle="Analyzed rides"
          icon={TrendingUp}
          delay={0.2}
        />
        <StatCard
          title="Most frequent"
          value={mostCommon ? `${mostCommon.miles} miles` : "N/A"}
          subtitle="Trip distance"
          icon={Navigation}
          delay={0.3}
        />
      </div>

      {/* Chart */}
      <DistanceChart data={processedData} />
    </div>
  )
}

export default function DistanceDistributionPage() {
  return (
    <div className="space-y-8">
      <Header title="Distance Distribution" description="Analyze the distribution of trip lengths across all rides" />
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }
      >
        <DistanceDistributionContent />
      </Suspense>
    </div>
  )
}
