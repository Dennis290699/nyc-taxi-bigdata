from pyspark.sql import SparkSession
import re

def main():
    spark = SparkSession.builder.appName("Verify Paths").getOrCreate()
    
    base_path = "hdfs://hadoop-namenode:8020/data/nyc/raw/taxi-trips"
    print(f"Scanning: {base_path} ...")
    
    try:
        files_df = spark.read.format("binaryFile") \
            .option("recursiveFileLookup", "true") \
            .option("pathGlobFilter", "*.parquet") \
            .load(base_path)
            
        all_paths = [row.path for row in files_df.select("path").collect()]
        
        # The Regex I used
        year_pattern = re.compile(r'/\d{4}/')
        
        valid_files = []
        ignored_files = []
        
        for p in all_paths:
            if year_pattern.search(p):
                valid_files.append(p)
            else:
                ignored_files.append(p)
                
        # Write report to file to avoid truncation
        with open("/opt/spark-apps/outputs/verification_report.txt", "w") as f:
            f.write(f"Scanning: {base_path} ...\n\n")
            f.write("--- VALID FILES (Included) ---\n")
            for p in valid_files: f.write(f"  [OK] {p}\n")
            
            f.write("\n--- IGNORED FILES (Excluded) ---\n")
            for p in ignored_files: f.write(f"  [SKIP] {p}\n")
            
            f.write(f"\nSummary: {len(valid_files)} valid, {len(ignored_files)} ignored.\n")
            
        print("Verification report written to /opt/spark-apps/outputs/verification_report.txt")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
