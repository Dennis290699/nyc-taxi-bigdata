from pyspark.sql import SparkSession
from pyspark.sql.functions import col, month, dayofmonth, count, avg, round, when, lit, year
from pyspark.sql.types import IntegerType

def main():
    spark = SparkSession.builder \
        .appName("Advanced NYC Taxi Analytics V2") \
        .getOrCreate()
        
    print("Leyendo datos limpios...")
    df = spark.read.parquet("hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips")
    df.createOrReplaceTempView("trips")
    
    # 1. Time Series: Trips over time
    print("Generando 1/5: Trips Over Time...")
    # Group by date (using pickup datetime)
    df_timeseries = df.withColumn("date", df["tpep_pickup_datetime"].cast("date")) \
        .groupBy("date") \
        .agg(
            count("*").alias("total_trips"),
            round(avg("fare_amount"), 2).alias("avg_fare")
        ) \
        .orderBy("date")
        
    df_timeseries.coalesce(1).write.mode("overwrite").json("hdfs://hadoop-namenode:8020/data/nyc/analytics/v2/trips-over-time")
    
    # Pre-calculate year column for subsequent aggregations
    df_with_year = df.withColumn("year", year(col("tpep_pickup_datetime")))

    # 2. Payment Stats
    print("Generando 2/5: Payment Stats...")
    # Group by Payment Type AND Year
    df_payments = df_with_year.groupBy("payment_type", "year") \
        .count() \
        .withColumnRenamed("count", "total_count") \
        .withColumn("payment_desc", when(col("payment_type") == 1, "Credit Card")
                                  .when(col("payment_type") == 2, "Cash")
                                  .when(col("payment_type") == 3, "No Charge")
                                  .when(col("payment_type") == 4, "Dispute")
                                  .otherwise("Unknown"))
    
    df_payments.coalesce(1).write.mode("overwrite").json("hdfs://hadoop-namenode:8020/data/nyc/analytics/v2/payment-stats")
    
    # 3. Top Zones
    print("Generando 3/5: Top Zones...")
    # Group by Zone AND Year
    df_zones = df_with_year.groupBy("PULocationID", "year") \
        .count() \
        .withColumnRenamed("count", "pickup_count") \
        .withColumnRenamed("PULocationID", "ZoneID")
        
    df_zones.coalesce(1).write.mode("overwrite").json("hdfs://hadoop-namenode:8020/data/nyc/analytics/v2/top-zones")
    
    # 4. Tip Analysis
    print("Generando 4/5: Tip Analysis...")
    # Group by Distance Bucket AND Year
    df_tips = df_with_year.withColumn("distance_bucket", 
                           when(col("trip_distance") < 2, "0-2 miles")
                           .when((col("trip_distance") >= 2) & (col("trip_distance") < 5), "2-5 miles")
                           .when((col("trip_distance") >= 5) & (col("trip_distance") < 10), "5-10 miles")
                           .otherwise("10+ miles")) \
                .groupBy("distance_bucket", "year") \
                .agg(
                    round(avg("tip_amount"), 2).alias("avg_tip"),
                    round(avg("total_amount"), 2).alias("avg_total"),
                    count("*").alias("trip_count")
                ) \
                .withColumn("tip_percentage", round((col("avg_tip") / col("avg_total")) * 100, 2))
                
    df_tips.coalesce(1).write.mode("overwrite").json("hdfs://hadoop-namenode:8020/data/nyc/analytics/v2/tip-analysis")
    
    # 5. Trip Distance Distribution
    print("Generando 5/5: Distance Distribution...")
    # Group by Mile Bucket AND Year
    df_dist = df_with_year.select(round(col("trip_distance"), 0).cast(IntegerType()).alias("miles"), "year") \
        .groupBy("miles", "year") \
        .count() \
        .filter("miles < 50") \
        
    df_dist.coalesce(1).write.mode("overwrite").json("hdfs://hadoop-namenode:8020/data/nyc/analytics/v2/distance-distribution")
    
    print("Analisis V2 completado exitosamente.")

if __name__ == "__main__":
    main()
