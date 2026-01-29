from pyspark.sql import SparkSession
from pyspark.sql.functions import year, col, min, max, count

def main():
    spark = SparkSession.builder \
        .appName("Debug NYC Taxi Data Range") \
        .getOrCreate()
    
    print("Reading processed data from: hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips")
    try:
        df = spark.read.parquet("hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips")
        
        # Cache for performance
        df.cache()
        
        print("Total count:", df.count())
        
        print("Aggregating by year...")
        df_years = df.withColumn("year", year(col("tpep_pickup_datetime"))) \
                     .groupBy("year") \
                     .agg(
                         count("*").alias("count"),
                         min("tpep_pickup_datetime").alias("min_date"),
                         max("tpep_pickup_datetime").alias("max_date")
                     ) \
                     .orderBy("year")
                     
        # df_years.show(100, truncate=False)
        
        # Write to single CSV for easy reading
        df_years.coalesce(1).write.mode("overwrite").option("header", "true").csv("hdfs://hadoop-namenode:8020/data/nyc/debug_ranges.csv")
        print("Debug data written to hdfs://hadoop-namenode:8020/data/nyc/debug_ranges.csv")
        
    except Exception as e:
        print(f"Error reading processed data: {e}")

if __name__ == "__main__":
    main()
