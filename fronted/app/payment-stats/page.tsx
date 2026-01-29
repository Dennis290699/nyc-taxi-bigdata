"use client"

import { Suspense, useState, useMemo } from "react"
import useSWR from "swr"
import { Header } from "@/components/layout/header"
import { PaymentChart } from "@/components/charts/payment-chart"
import { StatCard } from "@/components/stats/stat-card"
import { CreditCard, Wallet, PieChart } from "lucide-react"
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
import { PaymentStat } from "@/lib/types"
import { ALLOWED_YEARS } from "@/lib/utils"
import { ErrorState } from "@/components/ui/error-state"

function PaymentStatsContent() {
  const { data, error, isLoading } = useSWR("/payment-stats", api.getPaymentStats)
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

    // 2. Aggregate (if "all" is selected, we might have multiple rows for same payment_type but different years)
    // Even if filtered by year, it's good practice to ensure uniqueness by key
    const aggregationMap = new Map<number, PaymentStat>()

    filtered.forEach((item) => {
      const existing = aggregationMap.get(item.payment_type)
      if (existing) {
        existing.total_count += item.total_count
      } else {
        // Clone to avoid mutating original SWR data
        aggregationMap.set(item.payment_type, { ...item })
      }
    })

    return Array.from(aggregationMap.values())
  }, [data, selectedYear])

  if (error) {
    return (
      <ErrorState
        title="Failed to load payment data"
        description={error.message || "An unexpected error occurred while fetching payment statistics."}
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

  const total = processedData.reduce((sum, item) => sum + item.total_count, 0)
  const mostPopular = processedData.length > 0 ? processedData.reduce((max, item) => (item.total_count > max.total_count ? item : max)) : null
  const paymentTypes = processedData.length

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Payment Distribution</h2>
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
          title="Total Transactions"
          value={total.toLocaleString()}
          subtitle={selectedYear === "all" ? "All time" : `in ${selectedYear}`}
          icon={Wallet}
          delay={0.1}
        />
        <StatCard
          title="Most Popular"
          value={mostPopular ? mostPopular.payment_desc : "N/A"}
          subtitle={mostPopular ? `${((mostPopular.total_count / total) * 100).toFixed(1)}% of trips` : "N/A"}
          icon={CreditCard}
          delay={0.2}
        />
        <StatCard title="Payment Types" value={paymentTypes} subtitle="Available methods" icon={PieChart} delay={0.3} />
      </div>

      {/* Chart */}
      <PaymentChart data={processedData} />
    </div>
  )
}

export default function PaymentStatsPage() {
  return (
    <div className="space-y-8">
      <Header title="Payment Statistics" description="Explore payment method preferences and transaction patterns" />
      <Suspense
        fallback={
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        }
      >
        <PaymentStatsContent />
      </Suspense>
    </div>
  )
}
