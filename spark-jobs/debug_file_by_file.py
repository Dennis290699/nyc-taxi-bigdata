from pyspark.sql import SparkSession
from pyspark.sql.functions import col, lit
from pyspark.sql.types import TimestampType, DoubleType, LongType, IntegerType

def standardize_and_union(spark, file_paths):
    final_df = None
    success_count = 0
    fail_count = 0

    for path in file_paths:
        try:
            # Read single file, infer schema
            df = spark.read.parquet(path)
            
            # Lowercase columns
            for c in df.columns:
                df = df.withColumnRenamed(c, c.lower())
                
            # Cast safe
            def safe_cast(d, c_name, t_type):
                if c_name in d.columns:
                    return d.withColumn(c_name, col(c_name).cast(t_type))
                return d
            
            df = safe_cast(df, "vendorid", LongType())
            df = safe_cast(df, "passenger_count", DoubleType())
            df = safe_cast(df, "trip_distance", DoubleType())
            df = safe_cast(df, "fare_amount", DoubleType())
            df = safe_cast(df, "total_amount", DoubleType())
            df = safe_cast(df, "airport_fee", DoubleType())
            
            if final_df is None:
                final_df = df
            else:
                final_df = final_df.unionByName(df, allowMissingColumns=True)
            success_count += 1
        except Exception as e:
            print(f"Failed {path}: {e}")
            fail_count += 1
            
    print(f"Success: {success_count}, Fail: {fail_count}")
    if final_df:
        print(f"Total Rows: {final_df.count()}")
        final_df.printSchema()

def main():
    spark = SparkSession.builder.appName("Debug File By File").getOrCreate()
    spark.sparkContext.setLogLevel("ERROR")
    
    # Test with 2020 files
    base = "hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips/2020"
    Path = spark._jvm.org.apache.hadoop.fs.Path
    fs = Path(base).getFileSystem(spark._jsc.hadoopConfiguration())
    files = [f.getPath().toString() for f in fs.listStatus(Path(base)) if f.getPath().getName().endswith(".parquet")]
    
    print(f"Testing 2020 with {len(files)} files...")
    standardize_and_union(spark, files)
    
    spark.stop()

if __name__ == "__main__":
    main()
