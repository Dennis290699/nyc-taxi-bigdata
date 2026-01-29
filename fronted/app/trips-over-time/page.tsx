"use client"

import { Suspense, useState, useMemo, useEffect } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { TripsChart } from "@/components/charts/trips-chart"
import { StatCard } from "@/components/stats/stat-card"
import { TrendingUp, DollarSign, Calendar } from "lucide-react"
import { api } from "@/lib/api"
import { ALLOWED_YEARS } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ErrorState } from "@/components/ui/error-state"

function TripsOverTimeContent() {
  const { data, error, isLoading } = useSWR("/trips-over-time", api.getTripsOverTime)

  // State
  const [selectedYear, setSelectedYear] = useState<string>("all")
  const [selectedMonth, setSelectedMonth] = useState<string>("all")

  // Extract available years
  const availableYears = useMemo(() => {
    if (!data) return []
    const years = new Set(data.map((t) => new Date(t.date).getFullYear().toString()))
    // Filter by ALLOWED_YEARS
    const allowed = Array.from(years).filter(y => ALLOWED_YEARS.includes(Number(y)))
    return allowed.sort().reverse()
  }, [data])

  // Extract available months for selected year
  const availableMonths = useMemo(() => {
    if (!data || selectedYear === "all") return []
    const months = new Set(
      data
        .filter((t) => new Date(t.date).getFullYear().toString() === selectedYear)
        .map((t) => new Date(t.date).toLocaleString('en-US', { month: 'short' }))
    )
    return Array.from(months)
  }, [data, selectedYear])

  // Auto-select first month when year changes
  useEffect(() => {
    if (selectedYear !== "all" && availableMonths.length > 0) {
      if (selectedMonth === "all" || !availableMonths.includes(selectedMonth)) {
        setSelectedMonth(availableMonths[0])
      }
    } else {
      setSelectedMonth("all")
    }
  }, [selectedYear, availableMonths])

  // 1. Primary Chart Data (Annual or Monthly Aggregated)
  const primaryChartData = useMemo(() => {
    if (!data) return []

    if (selectedYear === "all") {
      // Group by Year for Annual View
      const aggregated = data.reduce((acc, curr) => {
        const year = new Date(curr.date).getFullYear().toString()
        // SKIP disallowed years
        if (!ALLOWED_YEARS.includes(Number(year))) return acc

        if (!acc[year]) acc[year] = {
          date: year, // Label is just the Year
          total_trips: 0,
          avg_fare: 0,
          count: 0
        }
        acc[year].total_trips += curr.total_trips
        acc[year].avg_fare += curr.avg_fare
        acc[year].count += 1
        return acc
      }, {} as Record<string, any>)

      return Object.values(aggregated)
        .sort((a, b) => a.date.localeCompare(b.date))
        .map(item => ({
          ...item,
          avg_fare: Number((item.avg_fare / item.count).toFixed(2))
        }))
    } else {
      // Group by Month for Specific Year View
      const filtered = data.filter((t) => new Date(t.date).getFullYear().toString() === selectedYear)

      const aggregated = filtered.reduce((acc, curr) => {
        const dateObj = new Date(curr.date)
        const monthKey = dateObj.getMonth() // 0-11
        const monthLabel = dateObj.toLocaleString('en-US', { month: 'short' }) // "Jan", "Feb"

        if (!acc[monthKey]) acc[monthKey] = {
          date: monthLabel,
          total_trips: 0,
          avg_fare: 0,
          count: 0,
          rawDate: dateObj
        }
        acc[monthKey].total_trips += curr.total_trips
        acc[monthKey].avg_fare += curr.avg_fare
        acc[monthKey].count += 1
        return acc
      }, {} as Record<number, any>)

      // Sort by month index
      return Object.keys(aggregated)
        .map(Number)
        .sort((a, b) => a - b)
        .map(key => {
          const item = aggregated[key]
          return {
            date: item.date,
            total_trips: item.total_trips,
            avg_fare: Number((item.avg_fare / item.count).toFixed(2))
          }
        })
    }
  }, [data, selectedYear])

  // 2. Secondary Chart Data (Daily for Selected Month)
  const secondaryChartData = useMemo(() => {
    if (!data || selectedYear === "all") return []

    // Determine target month (default to first available if "all" or invalid)
    let targetMonth = selectedMonth
    if (targetMonth === "all" && availableMonths.length > 0) {
      targetMonth = availableMonths[0]
    }

    // Filter by Year AND Month
    return data
      .filter((t) => {
        const d = new Date(t.date)
        return (
          d.getFullYear().toString() === selectedYear &&
          d.toLocaleString('en-US', { month: 'short' }) === targetMonth
        )
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        ...item,
        date: new Date(item.date).getDate().toString() // Show Day number as label
      }))

  }, [data, selectedYear, selectedMonth, availableMonths])

  if (error) {
    return (
      <ErrorState
        title="Failed to load trips data"
        description={error.message || "Unable to retrieve trip history. Please check your connection."}
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

  // Helper to calculate stats
  const calculateStats = (dataset: any[], viewType: 'year' | 'month') => {
    const totalTrips = dataset.reduce((sum, item) => sum + item.total_trips, 0)
    const avgFare = dataset.length > 0 ? dataset.reduce((sum, item) => sum + item.avg_fare, 0) / dataset.length : 0
    const maxTrips = dataset.length > 0 ? Math.max(...dataset.map((item: any) => item.total_trips)) : 0
    const peakDay = dataset.find((item: any) => item.total_trips === maxTrips)
    return { totalTrips, avgFare, maxTrips, peakDay }
  }

  // Calculate Stats separately
  const yearStats = calculateStats(primaryChartData, 'year')
  const monthStats = calculateStats(secondaryChartData, 'month')

  return (
    <div className="space-y-12">
      {/* SECTION 1: ANNUAL OVERVIEW */}
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">
            {selectedYear === 'all' ? 'All Time Overview' : `Yearly Overview (${selectedYear})`}
          </h2>
          <Select value={selectedYear} onValueChange={(val) => {
            setSelectedYear(val)
            setSelectedMonth("all") // Reset month on year change
          }}>
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

        {/* Annual Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          <StatCard
            title="Total Trips"
            value={yearStats.totalTrips.toLocaleString()}
            subtitle={selectedYear === "all" ? "All time" : `in ${selectedYear}`}
            icon={TrendingUp}
            delay={0.1}
          />
          <StatCard
            title="Average Fare"
            value={`$${yearStats.avgFare.toFixed(2)}`}
            subtitle="Per trip"
            icon={DollarSign}
            delay={0.2}
          />
          <StatCard
            title={selectedYear === "all" ? "Peak Year" : "Peak Month"}
            value={yearStats.peakDay ? yearStats.maxTrips.toLocaleString() : "N/A"}
            subtitle={yearStats.peakDay ? yearStats.peakDay.date : "N/A"}
            icon={Calendar}
            delay={0.3}
          />
        </div>

        {/* Primary Chart */}
        <div className="space-y-4">
          <TripsChart
            data={primaryChartData}
            onClick={(item) => {
              if (selectedYear !== 'all') {
                if (availableMonths.includes(item.date)) {
                  setSelectedMonth(item.date)
                }
              }
            }}
          />
        </div>
      </div>

      {/* SECTION 2: MONTHLY OVERVIEW (Conditional) */}
      {selectedYear !== "all" && secondaryChartData.length > 0 && (
        <div className="space-y-8 pt-8 border-t">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Monthly Detail ({selectedMonth === 'all' && availableMonths.length > 0 ? availableMonths[0] : selectedMonth})
            </h2>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Month" />
              </SelectTrigger>
              <SelectContent>
                {availableMonths.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Monthly Stats */}
          <div className="grid gap-6 md:grid-cols-3">
            <StatCard
              title="Total Trips"
              value={monthStats.totalTrips.toLocaleString()}
              subtitle={`in ${selectedMonth}`}
              icon={TrendingUp}
              delay={0.1}
            />
            <StatCard
              title="Average Fare"
              value={`$${monthStats.avgFare.toFixed(2)}`}
              subtitle="Per trip"
              icon={DollarSign}
              delay={0.2}
            />
            <StatCard
              title="Peak Day"
              value={monthStats.peakDay ? monthStats.maxTrips.toLocaleString() : "N/A"}
              subtitle={monthStats.peakDay ? monthStats.peakDay.date : "N/A"}
              icon={Calendar}
              delay={0.3}
            />
          </div>

          {/* Secondary Chart */}
          <div className="space-y-4">
            <TripsChart data={secondaryChartData} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function TripsOverTimePage() {
  return (
    <div className="space-y-8">
      <Header title="Trips Over Time" description="Analyze trip volume and fare trends across time periods" />
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }
      >
        <TripsOverTimeContent />
      </Suspense>
    </div>
  )
}
