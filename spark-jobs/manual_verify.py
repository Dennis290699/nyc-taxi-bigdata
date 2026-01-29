from pyspark.sql import SparkSession
import sys

def main():
    print("====================================")
    print("   MANUAL DATA VERIFICATION START")
    print("====================================")
    
    spark = SparkSession.builder \
        .appName("ManualVerification") \
        .getOrCreate()
        
    path = "hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips"
    print(f"Reading from: {path}")
    
    try:
        df = spark.read.parquet(path)
        count = df.count()
        print(f"STATUS: SUCCESS")
        print(f"TOTAL RECORDS: {count}")
        print("SAMPLE DATA:")
        df.show(5)
    except Exception as e:
        print(f"STATUS: FAILED")
        print(f"ERROR: {e}")
        
    print("====================================")
    print("   MANUAL DATA VERIFICATION END")
    print("====================================")
    spark.stop()

if __name__ == "__main__":
    main()
