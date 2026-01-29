from pyspark.sql import SparkSession

def main():
    spark = SparkSession.builder \
        .appName("Inspect Schemas") \
        .getOrCreate()
    
    # Paths (grab one file from each year)
    # Note: These paths are based on what I saw in 'ls' output earlier
    path_2020 = "hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips/2020"
    path_2024 = "hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips/2024"
    
    with open("/opt/spark-apps/debug_schema.txt", "w") as f:
        f.write("=== SCHEMA 2020 ===\n")
        try:
            df_2020 = spark.read.parquet(path_2020)
            f.write(df_2020._jdf.schema().treeString() + "\n")
            f.write(f"First row 2020: {df_2020.first()}\n")
        except Exception as e:
            f.write(f"Error reading 2020: {e}\n")

        f.write("\n=== SCHEMA 2024 ===\n")
        try:
            df_2024 = spark.read.parquet(path_2024)
            f.write(df_2024._jdf.schema().treeString() + "\n")
            f.write(f"First row 2024: {df_2024.first()}\n")
        except Exception as e:
            f.write(f"Error reading 2024: {e}\n")
            
    print("Schema info written to /opt/spark-apps/debug_schema.txt")

if __name__ == "__main__":
    main()
