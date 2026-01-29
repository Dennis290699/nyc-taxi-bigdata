const express = require('express');
const router = express.Router();
const hdfs = require('../services/hdfs.service');

// Wrapper for HDFS read
async function readHdfsData(path, res) {
    try {
        const rawData = await hdfs.readFileFromHDFS(path);

        // Handle Spark NDJSON output (one JSON object per line)
        if (typeof rawData === 'string') {
            const jsonArrayString = '[' + rawData.trim().replace(/\n/g, ',') + ']';
            try {
                const parsedData = JSON.parse(jsonArrayString);
                res.json(parsedData);
            } catch (e) {
                // Return string if parsing fails
                res.send(rawData);
            }
        } else {
            // Already JSON
            res.json(rawData);
        }
    } catch (error) {
        console.error(`Error reading ${path}:`, error);
        res.status(500).json({ error: 'Failed to fetch data', details: error.message });
    }
}

// 1. Time Series
router.get('/trips-over-time', (req, res) => {
    readHdfsData('/data/nyc/analytics/v2/trips-over-time', res);
});

// 2. Payment Stats
router.get('/payment-stats', (req, res) => {
    readHdfsData('/data/nyc/analytics/v2/payment-stats', res);
});

// 3. Top Zones
router.get('/top-zones', (req, res) => {
    readHdfsData('/data/nyc/analytics/v2/top-zones', res);
});

// 4. Tip Analysis
router.get('/tip-analysis', (req, res) => {
    readHdfsData('/data/nyc/analytics/v2/tip-analysis', res);
});

// 5. Distance Distribution
router.get('/distance-distribution', (req, res) => {
    readHdfsData('/data/nyc/analytics/v2/distance-distribution', res);
});

// 6. System Stats (Dashboard Home - Enhanced)
router.get('/system-stats', async (req, res) => {
    try {
        console.log("Fetching enhanced system stats...");

        // 1. Storage Summary (Folder level)
        const summaryPromise = hdfs.getSummary('/data/nyc');

        // 2. Global Cluster Health (JMX)
        const jmxPromise = hdfs.getJMXMetrics();

        // 3. Business Data Summary (Calculate from pre-aggregated time series)
        // Helper to parse Spark JSON output
        const parseSparkJson = (data) => {
            if (!data) return [];
            if (Array.isArray(data)) return data; // Already valid array
            if (typeof data === 'object') return [data]; // Single object
            if (typeof data === 'string') {
                try {
                    // Try parsing as standard JSON first
                    return JSON.parse(data);
                } catch (e) {
                    // If failed, assume NDJSON
                    try {
                        return data.trim().split('\n')
                            .filter(line => line.trim().length > 0)
                            .map(line => JSON.parse(line.trim()));
                    } catch (e2) {
                        console.error("Error parsing Spark JSON:", e2);
                        return [];
                    }
                }
            }
            return [];
        };

        // 3. Business Data Aggregation
        // We read multiple analytics files to build a comprehensive summary
        const analyticsPromises = {
            trips: hdfs.readFileFromHDFS('/data/nyc/analytics/v2/trips-over-time').catch(() => null),
            payments: hdfs.readFileFromHDFS('/data/nyc/analytics/v2/payment-stats').catch(() => null),
            dist: hdfs.readFileFromHDFS('/data/nyc/analytics/v2/distance-distribution').catch(() => null)
        };

        const [dirSummary, globalMetrics, analyticsData] = await Promise.all([
            summaryPromise,
            jmxPromise,
            Promise.all([analyticsPromises.trips, analyticsPromises.payments, analyticsPromises.dist])
        ]);

        const [tripsRaw, paymentsRaw, distRaw] = analyticsData;
        const trips = parseSparkJson(tripsRaw);
        const payments = parseSparkJson(paymentsRaw);
        const dist = parseSparkJson(distRaw);

        // Calculate Business Metrics
        let businessStats = { note: "Processing..." };

        if (trips.length > 0) {
            const totalTrips = trips.reduce((sum, day) => sum + (day.total_trips || 0), 0);

            // Revenue Estimate (daily avg_fare * daily trips)
            const totalRevenue = trips.reduce((sum, day) => sum + ((day.avg_fare || 0) * (day.total_trips || 0)), 0);
            const globalAvgFare = totalTrips > 0 ? totalRevenue / totalTrips : 0;

            const dates = trips.map(r => r.date).sort();

            businessStats = {
                total_trips: totalTrips,
                total_revenue: totalRevenue,
                avg_fare: globalAvgFare,
                date_start: dates[0],
                date_end: dates[dates.length - 1],
                days_analyzed: trips.length
            };
        }

        if (payments.length > 0) {
            // Find most common payment method (aggregated across years)
            const paymentCounts = {};
            payments.forEach(p => {
                const current = paymentCounts[p.payment_desc] || 0;
                paymentCounts[p.payment_desc] = current + p.total_count;
            });
            const topPayment = Object.entries(paymentCounts).sort((a, b) => b[1] - a[1])[0];
            if (topPayment) {
                businessStats.top_payment_method = topPayment[0];
            }
        }

        if (dist.length > 0) {
            // Calculate weighted average distance
            const totalDistTrips = dist.reduce((sum, d) => sum + d.count, 0);
            const weightedDistSum = dist.reduce((sum, d) => sum + (d.miles * d.count), 0);
            if (totalDistTrips > 0) {
                businessStats.avg_distance = weightedDistSum / totalDistTrips;
            }
        }

        const stats = {
            infrastructure: {
                health: globalMetrics.State === 'active' ? 'Healthy' : 'Normal',
                active_datanodes: globalMetrics.NumLiveDataNodes || 1,
                dead_datanodes: globalMetrics.NumDeadDataNodes || 0,
                volume: {
                    capacity_total_bytes: globalMetrics.CapacityTotal || 0,
                    capacity_used_bytes: globalMetrics.CapacityUsed || 0,
                    capacity_remaining_bytes: globalMetrics.CapacityRemaining || 0,
                    percent_used: globalMetrics.CapacityTotal ? ((globalMetrics.CapacityUsed / globalMetrics.CapacityTotal) * 100).toFixed(2) : 0
                },
                blocks: {
                    total: globalMetrics.BlocksTotal || 0,
                    missing: globalMetrics.MissingBlocks || 0,
                    corrupt: globalMetrics.CorruptBlocks || 0,
                    under_replicated: globalMetrics.UnderReplicatedBlocks || 0
                }
            },
            data_lake: {
                path: '/data/nyc',
                total_files: dirSummary.fileCount,
                total_directories: dirSummary.directoryCount,
                size_bytes: dirSummary.spaceConsumed
            },
            dataset_summary: businessStats,
            last_check: new Date().toISOString()
        };

        res.json(stats);
    } catch (error) {
        console.error("Error fetching system stats:", error);
        res.status(500).json({ error: 'Failed to fetch usage stats', details: error.message });
    }
});

module.exports = router;
