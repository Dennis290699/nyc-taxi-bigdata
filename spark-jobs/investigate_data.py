from pyspark.sql import SparkSession
from pyspark.sql.functions import col, month, year, count

def main():
    spark = SparkSession.builder.appName("Investigate Data").getOrCreate()
    spark.sparkContext.setLogLevel("ERROR")

    print("--- INVESTIGATING RAW DATA (2023) ---")
    try:
        df_raw = spark.read.parquet("hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips/2023/*.parquet")
        df_raw.select(year("tpep_pickup_datetime").alias("year"), month("tpep_pickup_datetime").alias("month")) \
              .groupBy("year", "month").count().orderBy("year", "month").show(20)
    except Exception as e:
        print(f"Error reading raw data: {e}")

    print("\n--- INVESTIGATING CLEANED DATA (2023) ---")
    try:
        df_clean = spark.read.parquet("hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips")
        df_clean.filter(year("tpep_pickup_datetime") == 2023) \
                .select(year("tpep_pickup_datetime").alias("year"), month("tpep_pickup_datetime").alias("month")) \
                .groupBy("year", "month").count().orderBy("year", "month").show(20)
    except Exception as e:
        print(f"Error reading cleaned data: {e}")

if __name__ == "__main__":
    main()
