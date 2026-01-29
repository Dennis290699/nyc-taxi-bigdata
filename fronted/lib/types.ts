// API Response Types
export interface SystemStats {
  infrastructure: {
    health: string
    active_datanodes: number
    volume: {
      capacity_total_bytes: number
      capacity_used_bytes: number
      percent_used: string
    }
    blocks: {
      missing: number
      corrupt: number
      total: number
    }
  }
  data_lake: {
    total_files: number
    size_bytes: number
    total_directories: number
  }
  dataset_summary: {
    total_trips: number
    date_start: string
    date_end: string
    total_revenue?: number
    avg_fare?: number
    top_payment_method?: string
  }
  last_check: string
}

export interface TripOverTime {
  date: string
  total_trips: number
  avg_fare: number
}

export interface PaymentStat {
  payment_type: number
  payment_desc: string
  total_count: number
  year: number
}

export interface TopZone {
  ZoneID: number
  pickup_count: number
  year: number
}

export interface TipAnalysis {
  distance_bucket: string
  avg_tip: number
  avg_total: number
  trip_count: number
  tip_percentage: number
  year: number
}

export interface DistanceDistribution {
  miles: number
  count: number
  year: number
}
