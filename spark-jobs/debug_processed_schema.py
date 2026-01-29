from pyspark.sql import SparkSession

def main():
    spark = SparkSession.builder \
        .appName("Debug Processed Schema") \
        .getOrCreate()
        
    spark.sparkContext.setLogLevel("ERROR")
    
    path = "hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips"
    print(f"Reading from {path}...")
    
    try:
        # Try default read (mergeSchema=False usually by default, or depends on config)
        df = spark.read.parquet(path)
        print("Default read successful.")
        df.printSchema()
        print(f"Count: {df.count()}")
        
    except Exception as e:
        print(f"Default read failed: {e}")
        
        try:
            print("Retrying with mergeSchema=true...")
            df = spark.read.option("mergeSchema", "true").parquet(path)
            print("Read with mergeSchema successful.")
            df.printSchema()
        except Exception as e2:
            print(f"Read with mergeSchema failed: {e2}")

if __name__ == "__main__":
    main()
