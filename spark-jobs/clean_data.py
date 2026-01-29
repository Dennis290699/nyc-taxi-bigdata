from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit, when
from pyspark.sql.types import TimestampType, DoubleType, LongType, IntegerType
import sys
import re

def main():
    spark = SparkSession.builder \
        .appName("Clean NYC Taxi Data") \
        .config("spark.sql.caseSensitive", "false") \
        .config("spark.sql.parquet.enableVectorizedReader", "false") \
        .config("spark.sql.parquet.mergeSchema", "false") \
        .getOrCreate()
    
    base_path = "hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips"
    
    # 1. Discovery: Find all year directories (e.g., /2020, /2024)
    # We use Hadoop FileSystem API to list directories
    Path = spark._jvm.org.apache.hadoop.fs.Path
    fs = Path(base_path).getFileSystem(spark._jsc.hadoopConfiguration())
    
    try:
        status_list = fs.listStatus(Path(base_path))
    except Exception as e:
        print(f"Error listing directories: {e}")
        return

    year_pattern = re.compile(r'/(\d{4})$')
    year_paths = []
    
    for status in status_list:
        path_str = status.getPath().toString()
        if status.isDirectory() and year_pattern.search(path_str):
            year_paths.append(path_str)
            
    print(f"Found {len(year_paths)} year directories: {year_paths}")
    
    if not year_paths:
        print("No valid year directories found.")
        return

    final_df = None
    
    # 2. Iterate and Standardize
    # 2. Iterate and Standardize
    # We use a file-by-file approach to handle "schema drift" within the same year.
    # Some files might be Int, others Double. Reading them individually allows Spark to infer 
    # the specific file's schema, and then we cast it to our standard superset schema in memory.
    
    from pyspark.sql.types import StructType, StructField, StringType, LongType, DoubleType, IntegerType, TimestampType

    # Helper to cast if exists
    def safe_cast(df, col_name, data_type):
        if col_name in df.columns:
            return df.withColumn(col_name, col(col_name).cast(data_type))
        return df

    for year_path in year_paths:
        print(f"Scanning {year_path}...")
        
        # Get list of all parquet files in this year directory
        try:
            # listStatus returns FileStatus objects
            file_statuses = fs.listStatus(Path(year_path))
            files = [f.getPath().toString() for f in file_statuses if f.getPath().getName().endswith(".parquet")]
            
            print(f"  Found {len(files)} files in {year_path}")
            
            for file_path in files:
                try:
                    # Read single file - let Spark infer schema for this specific file
                    df_file = spark.read.parquet(file_path)
                    
                    # Standardize Column Names (Lowercase)
                    for c in df_file.columns:
                        df_file = df_file.withColumnRenamed(c, c.lower())
                    
                    # Enforce Standard Types (Superset)
                    df_file = safe_cast(df_file, "tpep_pickup_datetime", TimestampType())
                    df_file = safe_cast(df_file, "tpep_dropoff_datetime", TimestampType())
                    df_file = safe_cast(df_file, "trip_distance", DoubleType())
                    df_file = safe_cast(df_file, "fare_amount", DoubleType())
                    df_file = safe_cast(df_file, "total_amount", DoubleType())
                    df_file = safe_cast(df_file, "passenger_count", DoubleType()) # Cast to double first (widest), could be cast to Long later if needed
                    df_file = safe_cast(df_file, "pulocationid", LongType())      # Long covers Int
                    df_file = safe_cast(df_file, "dolocationid", LongType())
                    df_file = safe_cast(df_file, "airport_fee", DoubleType())
                    df_file = safe_cast(df_file, "vendorid", LongType())
                    df_file = safe_cast(df_file, "payment_type", LongType())
                    df_file = safe_cast(df_file, "ratecodeid", DoubleType())
                    df_file = safe_cast(df_file, "extra", DoubleType())
                    df_file = safe_cast(df_file, "mta_tax", DoubleType())
                    df_file = safe_cast(df_file, "tip_amount", DoubleType())
                    df_file = safe_cast(df_file, "tolls_amount", DoubleType())
                    df_file = safe_cast(df_file, "improvement_surcharge", DoubleType())
                    df_file = safe_cast(df_file, "congestion_surcharge", DoubleType())

                    # Union
                    if final_df is None:
                        final_df = df_file
                    else:
                        final_df = final_df.unionByName(df_file, allowMissingColumns=True)
                        
                except Exception as e_file:
                    print(f"  [WARN] Failed to process file {file_path}: {e_file}")
                    
        except Exception as e_year:
            print(f"Error listing files in {year_path}: {e_year}")

    if final_df is None:
        print("No data loaded.")
        return

    # 4. Fill Nulls for missing columns created by unionByName
    # e.g., if 2020 didn't have airport_fee, it will be null now.
    # We can leave them as null or fill them. For analytics, safe to leave as null mostly.
    
    print("Applying filters and writing...")
    df_cleaned = final_df.filter(
        (col("pulocationid").isNotNull()) &
        (col("dolocationid").isNotNull()) &
        (col("fare_amount") > 0)
    )
    
    df_cleaned.write.mode('overwrite').parquet("hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips")
    print("Data cleaning complete.")

if __name__ == "__main__":
    main()