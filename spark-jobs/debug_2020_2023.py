from pyspark.sql import SparkSession
from pyspark.sql.functions import year, col, count

def debug_year(spark, year_val):
    print(f"\n{'='*50}")
    print(f"DEBUGGING YEAR {year_val}")
    print(f"{'='*50}")
    
    path = f"hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips/{year_val}"
    
    try:
        # Read with mergeSchema
        df = spark.read.option("mergeSchema", "true").parquet(path)
        
        print("\n[SCHEMA]")
        df.printSchema()
        
        # Check column names
        columns = [c.lower() for c in df.columns]
        if 'tpep_pickup_datetime' in columns:
            print("\n[DATE DISTRIBUTION]")
            # Find the actual case-sensitive name
            date_col = next(c for c in df.columns if c.lower() == 'tpep_pickup_datetime')
            
            # Group by year of pickup datetime
            df.select(year(col(date_col)).alias("pickup_year")) \
              .groupBy("pickup_year") \
              .agg(count("*").alias("count")) \
              .orderBy("pickup_year") \
              .show()
              
            print("\n[SAMPLE DATA]")
            df.select(date_col).show(5)
        else:
            print(f"\n[ERROR] 'tpep_pickup_datetime' column NOT found. Available columns: {df.columns}")

    except Exception as e:
        print(f"[ERROR] Failed to read {year_val}: {str(e)}")

def main():
    spark = SparkSession.builder \
        .appName("Debug 2020 2023") \
        .getOrCreate()
        
    spark.sparkContext.setLogLevel("ERROR")
    
    debug_year(spark, 2023)
    debug_year(spark, 2020)
    
    spark.stop()

if __name__ == "__main__":
    main()
