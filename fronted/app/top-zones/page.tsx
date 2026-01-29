"use client"

import { Suspense, useState, useMemo } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { ZonesChart } from "@/components/charts/zones-chart"
import { StatCard } from "@/components/stats/stat-card"
import { MapPin, TrendingUp, MapPinned } from "lucide-react"
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
import { TopZone } from "@/lib/types"
import { ALLOWED_YEARS } from "@/lib/utils"
import { ErrorState } from "@/components/ui/error-state"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

function TopZonesContent() {
  const { data, error, isLoading } = useSWR("/top-zones", api.getTopZones)
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

    // 2. Aggregate (Sum pickup_count by ZoneID)
    const aggregationMap = new Map<number, TopZone>()

    filtered.forEach((item) => {
      const existing = aggregationMap.get(item.ZoneID)
      if (existing) {
        existing.pickup_count += item.pickup_count
      } else {
        aggregationMap.set(item.ZoneID, { ...item })
      }
    })

    // 3. Sort and Slice Top 20
    return Array.from(aggregationMap.values())
      .sort((a, b) => b.pickup_count - a.pickup_count)
      .slice(0, 20)
  }, [data, selectedYear])


  if (error) {
    return (
      <ErrorState
        title="Failed to load zones data"
        description={error.message || "Could not fetch top pickup zones. Please try again later."}
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
        <Skeleton className="h-[550px] w-full" />
      </div>
    )
  }

  const totalPickups = processedData.reduce((sum, item) => sum + item.pickup_count, 0)
  const topZone = processedData.length > 0 ? processedData.reduce((max, item) => (item.pickup_count > max.pickup_count ? item : max)) : null
  const avgPickups = processedData.length > 0 ? totalPickups / processedData.length : 0

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Zone Performance</h2>
        <div className="flex items-center gap-4">
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
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          title="Total Pickups"
          value={totalPickups.toLocaleString()}
          subtitle={selectedYear === "all" ? "All zones combined" : `in ${selectedYear}`}
          icon={MapPin}
          delay={0.1}
        />
        <StatCard
          title="Top Zone"
          value={topZone ? `Zone ${topZone.ZoneID}` : "N/A"}
          subtitle={topZone ? `${topZone.pickup_count.toLocaleString()} pickups` : "N/A"}
          icon={MapPinned}
          delay={0.2}
        />
        <StatCard
          title="Average per Zone"
          value={Math.round(avgPickups).toLocaleString()}
          subtitle="Mean pickups (Top 20)"
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Chart */}
      <ZonesChart data={processedData} />
    </div>
  )
}

export default function TopZonesPage() {
  return (
    <div className="space-y-8">
      <Header title="Top Pickup Zones" description="Identify hotspots and high-demand areas across NYC" />
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }
      >
        <TopZonesContent />
      </Suspense>
    </div>
  )
}
