import type { SystemStats, TripOverTime, PaymentStat, TopZone, TipAnalysis, DistanceDistribution } from "./types"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v2"

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`)

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`)
  }

  return response.json()
}

export const api = {
  getSystemStats: () => fetchAPI<SystemStats>("/system-stats"),
  getTripsOverTime: () => fetchAPI<TripOverTime[]>("/trips-over-time"),
  getPaymentStats: () => fetchAPI<PaymentStat[]>("/payment-stats"),
  getTopZones: () => fetchAPI<TopZone[]>("/top-zones"),
  getTipAnalysis: () => fetchAPI<TipAnalysis[]>("/tip-analysis"),
  getDistanceDistribution: () => fetchAPI<DistanceDistribution[]>("/distance-distribution"),
}
