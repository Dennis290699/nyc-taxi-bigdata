from pyspark.sql import SparkSession
from pyspark.sql.functions import col, desc

def main():
    spark = SparkSession.builder \
        .appName("Intermediate Analytics on NYC Taxi Data") \
        .getOrCreate()

    df = spark.read.parquet("hdfs://hadoop-namenode:8020/data/nyc/processed/cleaned-trips")

    top_zones = df.groupBy("PULocationID").count().orderBy(desc("count")).limit(10)
    top_zones.write.mode('overwrite').json("hdfs://hadoop-namenode:8020/data/nyc/analytics/top-zones")

if __name__ == "__main__":
    main()